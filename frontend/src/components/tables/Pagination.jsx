import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

export default function Pagination({ page = 1, totalPages = 1, total = 0, limit = 10, onPageChange }) {
  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between pt-3 text-sm text-gray-400">
        <span>Menampilkan {total} data</span>
      </div>
    );
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex flex-col items-center justify-between gap-3 pt-3 sm:flex-row">
      <span className="text-sm text-gray-400">
        Menampilkan {from}–{to} dari {total} data
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-gray-800"
        >
          <HiOutlineChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <span key={p} className="flex items-center">
              {showEllipsis && <span className="px-1 text-gray-300">…</span>}
              <button
                onClick={() => onPageChange(p)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition',
                  p === page
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {p}
              </button>
            </span>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-gray-800"
        >
          <HiOutlineChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
