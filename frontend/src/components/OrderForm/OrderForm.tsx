import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './OrderForm.css';

interface OrderFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
}

export default function OrderForm({ onSubmit }: OrderFormProps) {
  const { t } = useTranslation();
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await onSubmit(newTitle, newDesc);
      setNewTitle('');
      setNewDesc('');
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="order-form__field">
        <label htmlFor="order-title-input" className="order-form__label">
          {t('forms.titleLabel')}
        </label>
        <input
          id="order-title-input"
          type="text"
          className="order-form__input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={t('forms.placeholderTitle')}
          required
        />
      </div>

      <div className="order-form__field order-form__field--large">
        <label htmlFor="order-desc-input" className="order-form__label">
          {t('forms.descLabel')}
        </label>
        <input
          id="order-desc-input"
          type="text"
          className="order-form__input"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder={t('forms.placeholderDesc')}
        />
      </div>

      <button type="submit" className="order-form__submit">
        {t('forms.save')}
      </button>
    </form>
  );
}