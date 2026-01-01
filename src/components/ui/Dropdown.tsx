import { type SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options, error, className, id, ...props }, ref) => {
    const dropdownId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyles = 'h-10 px-3 w-full rounded-md border text-sm transition-colors';
    const normalStyles = 'border-border focus:border-primary focus:ring-2 focus:ring-primary-soft focus:outline-none';
    const errorStyles = 'border-error focus:border-error focus:ring-2 focus:ring-error-soft focus:outline-none';
    const disabledStyles = 'bg-muted opacity-60 cursor-not-allowed';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={dropdownId}
            className="block text-sm font-medium text-text-primary mb-1"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={dropdownId}
          className={clsx(
            baseStyles,
            error ? errorStyles : normalStyles,
            props.disabled && disabledStyles,
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${dropdownId}-error` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p id={`${dropdownId}-error`} className="mt-1 text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
