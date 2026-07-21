import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({ label, error, hint, className, required, ...props }, ref) => {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'input-base',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500/30',
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
      {hint && !error && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    </label>
  );
});
Input.displayName = 'Input';

export const TextArea = forwardRef(({ label, error, hint, className, required, ...props }, ref) => {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <textarea
        ref={ref}
        rows={3}
        className={cn(
          'input-base resize-none',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500/30',
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
      {hint && !error && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    </label>
  );
});
TextArea.displayName = 'TextArea';

export const Select = forwardRef(
  ({ label, error, hint, className, required, children, ...props }, ref) => {
    return (
      <label className="block">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        )}
        <select
          ref={ref}
          className={cn(
            'input-base appearance-none bg-no-repeat pr-9',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500/30',
            className
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.1em',
          }}
          {...props}
        >
          {children}
        </select>
        {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
        {hint && !error && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
      </label>
    );
  }
);
Select.displayName = 'Select';

export default Input;
