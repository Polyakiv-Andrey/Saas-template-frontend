import React from 'react';
import './Input.scss';

interface InputProps {
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label,
  className,
}) => {
  return (
    <div className={`input-container ${className || ''}`}>
      {label && <label className="input__label">{label}</label>}
      <input
        type={type}
        className={`input ${error ? 'input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="input__error">{error}</span>}
    </div>
  );
}; 