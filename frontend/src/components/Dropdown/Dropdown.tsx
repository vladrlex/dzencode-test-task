import { useRef, useState, type ReactNode } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface DropdownOption<T extends string | number> {
  value: T;
  label: ReactNode;
}

interface DropdownProps<T extends string | number> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  triggerLabel?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
  triggerLabel,
  fullWidth = false,
  className = '',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  const selectedLabel = triggerLabel ?? options.find((option) => option.value === value)?.label;

  return (
    <div
      className={`dropdown-custom ${fullWidth ? 'dropdown-custom--full-width' : ''} ${className}`}
      ref={ref}
    >
      <button
        type="button"
        className={`dropdown-custom__toggle ${isOpen ? 'dropdown-custom__toggle--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <span className={`dropdown-custom__arrow ${isOpen ? 'dropdown-custom__arrow--open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="dropdown-custom__menu">
          {options.map((option) => (
            <div
              key={option.value}
              className={`dropdown-custom__item ${option.value === value ? 'dropdown-custom__item--selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
