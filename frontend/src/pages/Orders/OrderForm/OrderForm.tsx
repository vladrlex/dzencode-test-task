import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import FolderIcon from '../../../components/Icons/FolderIcon';
import DescriptionIcon from '../../../components/Icons/DescriptionIcon';
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
      <Input
        id="order-title-input"
        label={t('forms.titleLabel')}
        wrapperClassName="order-form__field"
        icon={<FolderIcon size={16} />}
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder={t('forms.placeholderTitle')}
        required
        autoFocus
      />

      <Input
        id="order-desc-input"
        label={t('forms.descLabel')}
        wrapperClassName="order-form__field order-form__field--large"
        icon={<DescriptionIcon size={16} />}
        type="text"
        value={newDesc}
        onChange={(e) => setNewDesc(e.target.value)}
        placeholder={t('forms.placeholderDesc')}
      />

      <Button type="submit">{t('forms.save')}</Button>
    </form>
  );
}
