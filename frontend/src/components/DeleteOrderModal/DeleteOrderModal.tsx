import '../DeleteOrderModal/DeteleOrderModal.css';

interface DeleteOrderModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteOrderModal({ onClose, onConfirm }: DeleteOrderModalProps) {
  return (
    <div className="delete-modal">
      <div className="delete-modal__content">
        <button className="delete-modal__close" onClick={onClose}>
          ✕
        </button>
        <h4 className="delete-modal__title">Are you sure you want to delete this order?</h4>
        <p className="delete-modal__text">This action cannot be undone.</p>
        <div className="delete-modal__actions">
          <button className="delete-modal__btn delete-modal__btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-modal__btn delete-modal__btn--confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
