import { useState, useEffect, useRef } from 'react';
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

  // Нові стейти для кастомного селекту
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Закриваємо випадайку при кліку поза нею
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <label htmlFor="product-title">{t('forms.productTitleLabel', { defaultValue: 'Название продукта' })}</label>
        <input 
          id="product-title"
          type="text" 
          minLength={3} 
          value={formData.title} 
          placeholder={t('forms.placeholderProductTitle', { defaultValue: 'например, Монитор' })} 
          required 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
        />
      </div>
      
      <div className="add-product-form__group">
        <label htmlFor="product-type">{t('forms.typeLabel', { defaultValue: 'Тип' })}</label>
        <input 
          id="product-type"
          type="text" 
          value={formData.type} 
          placeholder={t('forms.placeholderType', { defaultValue: 'например, Мониторы' })} 
          required 
          onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
        />
      </div>
      
      <div className="add-product-form__group">
        <label htmlFor="product-sn">{t('forms.serialNumberLabel', { defaultValue: 'Серийный номер' })}</label>
        <input 
          id="product-sn"
          type="number" 
          min="1" 
          value={formData.serialNumber} 
          placeholder={t('forms.placeholderSerialNumber', { defaultValue: 'например, 12345' })} 
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
          placeholder={t('forms.placeholderSpecification', { defaultValue: 'e.g. Intel X58, ATX' })}
          required 
          onChange={(e) => setFormData({ ...formData, specification: e.target.value })} 
        />
      </div>

      {/* НАШ КАСТОМНИЙ DROPDOWN СЕЛЕКТ */}
      <div className="add-product-form__group">
        <label>{t('forms.conditionLabel', { defaultValue: 'Condition' })}</label>
        <div className="dropdown-custom" ref={selectRef} style={{ width: '100%' }}>
          <button
            type="button" /* Важливо! Запобігає сабміту форми при кліку */
            className={`dropdown-custom__toggle ${isSelectOpen ? 'dropdown-custom__toggle--active' : ''}`}
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>
              {formData.isNew === '1' 
                ? t('forms.conditionNew', { defaultValue: 'New' }) 
                : t('forms.conditionUsed', { defaultValue: 'Used' })}
            </span>
            <span className={`dropdown-custom__arrow ${isSelectOpen ? 'dropdown-custom__arrow--open' : ''}`}>▼</span>
          </button>

          {isSelectOpen && (
            <div className="dropdown-custom__menu" style={{ width: '100%', boxSizing: 'border-box', zIndex: 100 }}>
              <div
                className={`dropdown-custom__item ${formData.isNew === '1' ? 'dropdown-custom__item--selected' : ''}`}
                onClick={() => {
                  setFormData({ ...formData, isNew: '1' });
                  setIsSelectOpen(false);
                }}
              >
                {t('forms.conditionNew', { defaultValue: 'New' })}
              </div>
              <div
                className={`dropdown-custom__item ${formData.isNew === '0' ? 'dropdown-custom__item--selected' : ''}`}
                onClick={() => {
                  setFormData({ ...formData, isNew: '0' });
                  setIsSelectOpen(false);
                }}
              >
                {t('forms.conditionUsed', { defaultValue: 'Used' })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="add-product-form__group">
        <label htmlFor="product-usd">{t('forms.priceUsdLabel', { defaultValue: 'Цена USD' })}</label>
        <input 
          id="product-usd"
          type="number" 
          min="0" 
          step="0.01" 
          value={formData.priceUsd} 
          placeholder={t('forms.placeholderPriceUsd', { defaultValue: 'например, 100' })} 
          required 
          onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })} 
        />
      </div>
      
      <div className="add-product-form__group">
        <label htmlFor="product-uah">{t('forms.priceUahLabel', { defaultValue: 'Цена UAH' })}</label>
        <input 
          id="product-uah"
          type="number" 
          min="0" 
          step="0.01" 
          value={formData.priceUah} 
          placeholder={t('forms.placeholderPriceUah', { defaultValue: 'например, 2600' })} 
          required 
          onChange={(e) => setFormData({ ...formData, priceUah: e.target.value })} 
        />
      </div>

      <div className="add-product-form__actions">
        <button type="button" className="add-product-form__cancel" onClick={onClose}>
          {t('forms.cancel', { defaultValue: 'Cancel' })}
        </button>
        <button type="submit" className="add-product-form__submit">
          {productToEdit ? t('forms.updateProduct', { defaultValue: 'Save' }) : t('forms.saveProduct', { defaultValue: 'Add' })}
        </button>
      </div>
    </form>
  );
}