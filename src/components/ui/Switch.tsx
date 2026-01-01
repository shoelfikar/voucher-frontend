import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className, id, checked, ...props }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-center">
        <label htmlFor={switchId} className="relative inline-block w-11 h-6 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <div
            className={clsx(
              'w-11 h-6 bg-secondary rounded-full peer',
              'peer-checked:bg-primary',
              'peer-focus:ring-2 peer-focus:ring-primary-soft',
              'transition-colors',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              className
            )}
          />
          <div
            className={clsx(
              'absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full',
              'transition-transform',
              'peer-checked:translate-x-5'
            )}
          />
        </label>
        {label && (
          <span className="ml-3 text-sm text-text-primary">
            {label}
          </span>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
