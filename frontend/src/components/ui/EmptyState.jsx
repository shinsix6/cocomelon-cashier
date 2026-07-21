import { HiOutlineInbox, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import Button from './Button';

export function EmptyState({
  icon: Icon = HiOutlineInbox,
  title = 'Belum ada data',
  description = 'Data akan muncul di sini setelah tersedia.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-6 py-14 text-center animate-fade-in">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Gagal memuat data',
  description = 'Terjadi kesalahan saat mengambil data dari server. Silakan coba lagi.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 px-6 py-14 text-center animate-fade-in">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
        <HiOutlineExclamationTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
      {onRetry && (
        <Button size="sm" variant="secondary" className="mt-4" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
