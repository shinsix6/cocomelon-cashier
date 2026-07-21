import { forwardRef } from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm shadow-brand-600/20 focus-visible:ring-brand-500/50',
  secondary:
    'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-gray-400/40',
  ghost:
    'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400/40',
  danger:
    'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 focus-visible:ring-red-400/40 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400',
  dangerSolid:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20 focus-visible:ring-red-500/50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className,
      loading = false,
      disabled = false,
      icon: Icon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <HiOutlineArrowPath className="h-4 w-4 animate-spin" />
        ) : (
          Icon && <Icon className="h-4 w-4 shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
