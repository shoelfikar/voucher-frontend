import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface InputIconProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export const InputIcon = forwardRef<HTMLInputElement, InputIconProps>(
  ({ label, error, helperText, leftIcon, rightIcon, onRightIconClick, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyles = 'h-10 w-full rounded-md border text-sm transition-colors';
    const normalStyles = 'border-border focus:border-primary focus:ring-2 focus:ring-primary-soft focus:outline-none';
    const errorStyles = 'border-error focus:border-error focus:ring-2 focus:ring-error-soft focus:outline-none';
    const disabledStyles = 'bg-muted opacity-60 cursor-not-allowed';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              baseStyles,
              error ? errorStyles : normalStyles,
              props.disabled && disabledStyles,
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              !leftIcon && !rightIcon && 'px-3',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {rightIcon && (
            <div
              className={clsx(
                "absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted",
                onRightIconClick && "cursor-pointer hover:text-text-primary transition-colors"
              )}
              onClick={onRightIconClick}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputIcon.displayName = 'InputIcon';
