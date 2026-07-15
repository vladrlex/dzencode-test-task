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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onSubmit(newTitle, newDesc).then(() => {
      setNewTitle('');
      setNewDesc('');
    });
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="order-form__field">
        <label className="order-form__label">{t('forms.titleLabel')}</label>
        <input
          type="text"
          className="order-form__input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={t('forms.placeholderTitle')}
          required
        />
      </div>
      <div className="order-form__field order-form__field--large">
        <label className="order-form__label">{t('forms.descLabel')}</label>
        <input
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