import type { InputHTMLAttributes, ReactNode } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  wrapperClassName?: string;
  icon?: ReactNode;
}

export default function Input({ label, id, wrapperClassName = '', icon, ...rest }: InputProps) {
  return (
    <div className={`input-field ${icon ? 'input-field--with-icon' : ''} ${wrapperClassName}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-field__control">
        {icon && <span className="input-field__icon">{icon}</span>}
        <input id={id} {...rest} />
      </div>
    </div>
  );
}
