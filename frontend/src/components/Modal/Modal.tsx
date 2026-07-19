import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import CloseButton from '../Buttons/CloseButton/CloseButton';
import './Modal.css';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export default function Modal({ onClose, children, title }: ModalProps) {
  const { t } = useTranslation();

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <CloseButton onClick={onClose} ariaLabel={t('a11y.closeModal')} />
        </div>
        <div className="modal-body-scroll">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
