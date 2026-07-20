import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeToast } from '../../store/uiSlice';
import './ToastContainer.css';

const AUTO_DISMISS_MS = 6000;

interface ToastItemProps {
  message: string;
  onDismiss: () => void;
}

function ToastItem({ message, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="toast-item" role="alert">
      <span className="toast-item__message">{message}</span>
      <button className="toast-item__close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          onDismiss={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
}
