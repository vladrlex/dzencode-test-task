import { useTranslation } from 'react-i18next';
import '../DeleteOrderModal/DeteleOrderModal.css';

interface DeleteOrderModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteOrderModal({ onClose, onConfirm }: DeleteOrderModalProps) {
  const { t } = useTranslation();

  return (
    <div className="delete-modal">
      <div className="delete-modal__content">
        <button className="delete-modal__close" onClick={onClose}>
          ✕
        </button>
        <h4 className="delete-modal__title">{t('modals.deleteTitle')}</h4>
        <p className="delete-modal__text">{t('modals.deleteText')}</p>
        <div className="delete-modal__actions">
          <button className="delete-modal__btn delete-modal__btn--cancel" onClick={onClose}>
            {t('modals.cancel')}
          </button>
          <button className="delete-modal__btn delete-modal__btn--confirm" onClick={onConfirm}>
            {t('modals.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}