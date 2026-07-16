import DeleteIcon from '../../Icons/DeleteIcon';
import './DeleteButton.css';

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  ariaLabel?: string;
  size?: number;
}

export default function DeleteButton({ 
  onClick, 
  className = '', 
  ariaLabel = 'Delete',
  size = 18 
}: DeleteButtonProps) {
  return (
    <button 
      className={`delete-btn ${className}`} 
      onClick={onClick} 
      aria-label={ariaLabel}
    >
      <DeleteIcon size={size} />
    </button>
  );
}