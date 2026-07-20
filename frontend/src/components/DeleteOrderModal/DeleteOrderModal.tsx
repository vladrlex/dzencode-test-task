import { useTranslation } from 'react-i18next';
import Modal from '../Modal/Modal';
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
        <button className="delete-modal__btn delete-modal__btn--cancel" onClick={onClose}>
          {t('modals.cancel')}
        </button>
        <button className="delete-modal__btn delete-modal__btn--confirm" onClick={onConfirm}>
          {t('modals.delete')}
        </button>
      </div>
    </Modal>
  );
}
