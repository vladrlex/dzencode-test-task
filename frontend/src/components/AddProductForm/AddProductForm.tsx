import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store/hooks';
import { addProductServer, updateProductServer, type Product } from '../../store/productsSlice';
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
      <div className="add-product-form__group">
        <label htmlFor="product-title">{t('forms.productTitleLabel')}</label>
        <input 
          id="product-title"
          type="text" 
          minLength={3} 
          value={formData.title} 
          placeholder={t('forms.placeholderProductTitle')} 
          required 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
        />
      </div>
      
      <div className="add-product-form__group">
        <label htmlFor="product-type">{t('forms.typeLabel')}</label>
        <input 
          id="product-type"
          type="text" 
          value={formData.type} 
          placeholder={t('forms.placeholderType')} 
          required 
          onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
        />
      </div>
      
      <div className="add-product-form__group">
        <label htmlFor="product-sn">{t('forms.serialNumberLabel')}</label>
        <input 
          id="product-sn"
          type="number" 
          min="1" 
          value={formData.serialNumber} 
          placeholder={t('forms.placeholderSerialNumber')} 
          required 
          onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} 
        />
      </div>

      <div className="add-product-form__group">
        <label htmlFor="product-spec">{t('forms.specificationLabel', { defaultValue: 'Specification' })}</label>
        <input 
          id="product-spec"
          type="text" 
          value={formData.specification} 
          placeholder="e.g. Intel X58, ATX" 
          required 
          onChange={(e) => setFormData({ ...formData, specification: e.target.value })} 
        />
      </div>

      <div className="add-product-form__group">
        <label htmlFor="product-condition">{t('forms.conditionLabel', { defaultValue: 'Condition' })}</label>
        <select 
          id="product-condition"
          value={formData.isNew}
          className="add-product-form__select"
          onChange={(e) => setFormData({ ...formData, isNew: e.target.value })}
        >
          <option value="1">New</option>
          <option value="0">Used</option>
        </select>
      </div>
      
      <div className="add-product-form__group">
        <label htmlFor="product-usd">{t('forms.priceUsdLabel')}</label>
        <input 
          id="product-usd"
          type="number" 
          min="0" 
          step="0.01" 
          value={formData.priceUsd} 
          placeholder={t('forms.placeholderPriceUsd')} 
          required 
          onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })} 
        />
      </div>
      
      <div className="add-product-form__group">
        <label htmlFor="product-uah">{t('forms.priceUahLabel')}</label>
        <input 
          id="product-uah"
          type="number" 
          min="0" 
          step="0.01" 
          value={formData.priceUah} 
          placeholder={t('forms.placeholderPriceUah')} 
          required 
          onChange={(e) => setFormData({ ...formData, priceUah: e.target.value })} 
        />
      </div>

      <button type="submit" className="add-product-form__submit">
        {productToEdit ? t('forms.updateProduct') : t('forms.saveProduct')}
      </button>
    </form>
  );
}