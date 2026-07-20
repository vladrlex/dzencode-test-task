import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  useClickOutside(ref, () => setIsOpen(false));

  const selectedLabel = triggerLabel ?? options.find((option) => option.value === value)?.label;
  const selectedIndex = options.findIndex((option) => option.value === value);

  const openAndFocus = (index: number) => {
    setIsOpen(true);
    requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAndFocus(selectedIndex >= 0 ? selectedIndex : 0);
    }
  };

  const selectOption = (option: DropdownOption<T>) => {
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectOption(options[index]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      optionRefs.current[Math.min(index + 1, options.length - 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      optionRefs.current[Math.max(index - 1, 0)]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`dropdown-custom ${fullWidth ? 'dropdown-custom--full-width' : ''} ${className}`}
      ref={ref}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`dropdown-custom__toggle ${isOpen ? 'dropdown-custom__toggle--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedLabel}</span>
        <span className={`dropdown-custom__arrow ${isOpen ? 'dropdown-custom__arrow--open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="dropdown-custom__menu" role="listbox">
          {options.map((option, index) => (
            <div
              key={option.value}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              role="option"
              aria-selected={option.value === value}
              tabIndex={0}
              className={`dropdown-custom__item ${option.value === value ? 'dropdown-custom__item--selected' : ''}`}
              onClick={() => selectOption(option)}
              onKeyDown={(e) => handleOptionKeyDown(e, index)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
