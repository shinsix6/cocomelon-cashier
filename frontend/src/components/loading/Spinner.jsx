import { cn } from '../../utils/cn';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-[3px]',
};

export default function Spinner({ size = 'md', className }) {
  return (
    <div
      role="status"
      aria-label="Memuat"
      className={cn(
        'animate-spin rounded-full border-brand-200 border-t-brand-600 dark:border-gray-700 dark:border-t-brand-500',
        sizes[size],
        className
      )}
    />
  );
}
