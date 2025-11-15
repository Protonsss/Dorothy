import { InputHTMLAttributes, forwardRef, useState } from 'react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const containerClasses = [
      'input-container',
      fullWidth && 'input-full-width',
      error && 'input-error',
      isFocused && 'input-focused',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label className="input-label" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="input-wrapper">
          {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
          <input
            ref={ref}
            className="input-field"
            onFocus={(): void => setIsFocused(true)}
            onBlur={(): void => setIsFocused(false)}
            {...props}
          />
          {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
        </div>
        {error && <p className="input-error-message">{error}</p>}
        {helperText && !error && (
          <p className="input-helper-text">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
