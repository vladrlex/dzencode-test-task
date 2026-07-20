import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`app-btn app-btn--${variant} ${fullWidth ? 'app-btn--full-width' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
