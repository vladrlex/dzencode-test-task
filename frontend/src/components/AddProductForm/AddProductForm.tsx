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
    priceUah: productToEdit?.price.find(p => p.symbol === 'UAH')?.value || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      title: formData.title,
      type: formData.type,
      serialNumber: Number(formData.serialNumber),
      order: orderId,
      price: [
        { value: Number(formData.priceUsd), symbol: 'USD', isDefault: 0 },
        { value: Number(formData.priceUah), symbol: 'UAH', isDefault: 1 }
      ],
      isNew: productToEdit ? productToEdit.isNew : 1,
      date: productToEdit ? productToEdit.date : new Date().toISOString(),
      photo: productToEdit ? productToEdit.photo : 'pathToFile.jpg',
      specification: productToEdit ? productToEdit.specification : 'Standard',
      guarantee: productToEdit ? productToEdit.guarantee : { start: new Date().toISOString(), end: new Date().toISOString() }
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
      <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
        {productToEdit ? t('orders.modalProductEditTitle') : t('orders.modalProductAddTitle')}
      </h2>

      <div className="add-product-form__group">
        <label>{t('forms.productTitleLabel')}</label>
        <input 
          type="text" 
          minLength={3} 
          value={formData.title} 
          placeholder={t('forms.placeholderProductTitle')} 
          required 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
        />
      </div>
      
      <div className="add-product-form__group">
        <label>{t('forms.typeLabel')}</label>
        <input 
          type="text" 
          value={formData.type} 
          placeholder={t('forms.placeholderType')} 
          required 
          onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
        />
      </div>
      
      <div className="add-product-form__group">
        <label>{t('forms.serialNumberLabel')}</label>
        <input 
          type="number" 
          min="1" 
          value={formData.serialNumber} 
          placeholder={t('forms.placeholderSerialNumber')} 
          required 
          onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} 
        />
      </div>
      
      <div className="add-product-form__group">
        <label>{t('forms.priceUsdLabel')}</label>
        <input 
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
        <label>{t('forms.priceUahLabel')}</label>
        <input 
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