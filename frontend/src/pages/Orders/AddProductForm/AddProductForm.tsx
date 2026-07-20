import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/hooks';
import { addProductServer, updateProductServer, type Product } from '../../../store/productsSlice';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import './AddProductForm.css';

interface AddProductFormProps {
  orderId: number;
  onClose: () => void;
  productToEdit?: Product | null;
}

export default function AddProductForm({ orderId, onClose, productToEdit }: AddProductFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    title: productToEdit?.title || '',
    type: productToEdit?.type || '',
    serialNumber: productToEdit?.serialNumber || '',
    priceUsd: productToEdit?.price.find(p => p.symbol === 'USD')?.value || '',
    priceUah: productToEdit?.price.find(p => p.symbol === 'UAH')?.value || '',
    specification: productToEdit?.specification || 'Standard',
    supplier: productToEdit?.supplier || '',
    isNew: productToEdit ? String(productToEdit.isNew) : '1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const twoYearsLater = new Date();
    twoYearsLater.setFullYear(today.getFullYear() + 2);

    const productData = {
      title: formData.title,
      type: formData.type,
      serialNumber: Number(formData.serialNumber),
      order: orderId,
      price: [
        { value: Number(formData.priceUsd), symbol: 'USD', isDefault: 0 },
        { value: Number(formData.priceUah), symbol: 'UAH', isDefault: 1 }
      ],
      isNew: Number(formData.isNew),
      date: productToEdit ? productToEdit.date : today.toISOString(),
      photo: productToEdit ? productToEdit.photo : 'pathToFile.jpg',
      specification: formData.specification,
      supplier: formData.supplier || null,
      guarantee: productToEdit ? productToEdit.guarantee : {
        start: today.toISOString(),
        end: twoYearsLater.toISOString()
      }
    };

    try {
      if (productToEdit) {
        await dispatch(updateProductServer({ ...productData, id: productToEdit.id } as Product)).unwrap();
      } else {
        await dispatch(addProductServer(productData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <Input
        id="product-title"
        label={t('forms.productTitleLabel', { defaultValue: 'Название продукта' })}
        type="text"
        minLength={3}
        value={formData.title}
        placeholder={t('forms.placeholderProductTitle', { defaultValue: 'например, Монитор' })}
        required
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <Input
        id="product-type"
        label={t('forms.typeLabel', { defaultValue: 'Тип' })}
        type="text"
        value={formData.type}
        placeholder={t('forms.placeholderType', { defaultValue: 'например, Мониторы' })}
        required
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      />

      <Input
        id="product-sn"
        label={t('forms.serialNumberLabel', { defaultValue: 'Серийный номер' })}
        type="number"
        min="1"
        value={formData.serialNumber}
        placeholder={t('forms.placeholderSerialNumber', { defaultValue: 'например, 12345' })}
        required
        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
      />

      <Input
        id="product-spec"
        label={t('forms.specificationLabel', { defaultValue: 'Specification' })}
        type="text"
        value={formData.specification}
        placeholder={t('forms.placeholderSpecification', { defaultValue: 'e.g. Intel X58, ATX' })}
        required
        onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
      />

      <Input
        id="product-supplier"
        label={t('forms.supplierLabel', { defaultValue: 'Supplier' })}
        type="text"
        value={formData.supplier}
        placeholder={t('forms.placeholderSupplier', { defaultValue: 'e.g. TechDistrib LLC' })}
        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
      />

      <div className="input-field">
        <label>{t('forms.conditionLabel', { defaultValue: 'Condition' })}</label>
        <Dropdown
          fullWidth
          options={[
            { value: '1', label: t('forms.conditionNew', { defaultValue: 'New' }) },
            { value: '0', label: t('forms.conditionUsed', { defaultValue: 'Used' }) },
          ]}
          value={formData.isNew}
          onChange={(isNew) => setFormData({ ...formData, isNew })}
        />
      </div>

      <Input
        id="product-usd"
        label={t('forms.priceUsdLabel', { defaultValue: 'Цена USD' })}
        type="number"
        min="0"
        step="0.01"
        value={formData.priceUsd}
        placeholder={t('forms.placeholderPriceUsd', { defaultValue: 'например, 100' })}
        required
        onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })}
      />

      <Input
        id="product-uah"
        label={t('forms.priceUahLabel', { defaultValue: 'Цена UAH' })}
        type="number"
        min="0"
        step="0.01"
        value={formData.priceUah}
        placeholder={t('forms.placeholderPriceUah', { defaultValue: 'например, 2600' })}
        required
        onChange={(e) => setFormData({ ...formData, priceUah: e.target.value })}
      />

      <div className="add-product-form__actions">
        <Button type="button" variant="ghost" onClick={onClose}>
          {t('forms.cancel', { defaultValue: 'Cancel' })}
        </Button>
        <Button type="submit">
          {productToEdit ? t('forms.updateProduct', { defaultValue: 'Save' }) : t('forms.saveProduct', { defaultValue: 'Add' })}
        </Button>
      </div>
    </form>
  );
}
