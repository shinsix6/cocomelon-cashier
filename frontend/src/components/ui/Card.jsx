import { cn } from '../../utils/cn';

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div className={cn('card', hover && 'card-hover', 'p-5', className)} {...props}>
      {children}
    </div>
  );
}

const chipColors = {
  emerald: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

export function StatCard({ label, value, icon: Icon, color = 'emerald', trend, className }) {
  return (
    <Card hover className={cn('flex items-start justify-between animate-slide-up', className)}>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <p className="mt-2 font-display text-2xl font-bold text-gray-900 dark:text-white truncate">
          {value}
        </p>
        {trend && (
          <p
            className={cn(
              'mt-1.5 text-xs font-medium',
              trend.direction === 'up' ? 'text-brand-600' : 'text-red-500'
            )}
          >
            {trend.direction === 'up' ? '▲' : '▼'} {trend.label}
          </p>
        )}
      </div>
      {Icon && (
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', chipColors[color])}>
          <Icon className="h-5 w-5" />
        </div>
      )}
    </Card>
  );
}
