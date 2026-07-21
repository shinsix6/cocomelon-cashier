import { cn } from '../../utils/cn';

const tones = {
  success: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
  danger: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  info: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
};

export default function Badge({ children, tone = 'neutral', dot = false, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
