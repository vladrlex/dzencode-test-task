import { useTranslation } from 'react-i18next';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import './DeteleOrderModal.css';

interface DeleteOrderModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
}

export default function DeleteOrderModal({
  onClose,
  onConfirm,
  title,
  itemName,
}: DeleteOrderModalProps) {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose} title={title || t('modals.deleteTitle')} size="sm">
      {itemName ? (
        <p className="delete-modal__text delete-modal__text--item">{itemName}</p>
      ) : (
        <p className="delete-modal__text">{t('modals.deleteText')}</p>
      )}

      <div className="delete-modal__actions">
        <Button variant="secondary" onClick={onClose}>
          {t('modals.cancel')}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {t('modals.delete')}
        </Button>
      </div>
    </Modal>
  );
}
