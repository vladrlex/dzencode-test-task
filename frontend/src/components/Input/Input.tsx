import type { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  wrapperClassName?: string;
}

export default function Input({ label, id, wrapperClassName = '', ...rest }: InputProps) {
  return (
    <div className={`input-field ${wrapperClassName}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...rest} />
    </div>
  );
}
