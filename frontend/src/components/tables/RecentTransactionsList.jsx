import { Link } from 'react-router-dom';
import { HiOutlineReceiptPercent } from 'react-icons/hi2';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { EmptyState } from '../ui/EmptyState';

export default function RecentTransactionsList({ transactions = [] }) {
  if (transactions.length === 0) {
    return <EmptyState title="Belum ada transaksi" description="Transaksi terbaru akan tampil di sini." />;
  }

  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
      {transactions.map((trx) => (
        <li key={trx._id ?? trx.id} className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <HiOutlineReceiptPercent className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                {trx.invoiceNumber || trx.code || `INV-${(trx._id ?? trx.id ?? '').toString().slice(-6)}`}
              </p>
              <p className="text-xs text-gray-400">
                {trx.cashierName || trx.cashier?.name || 'Kasir'} · {formatDateTime(trx.createdAt)}
              </p>
            </div>
          </div>
          <span className="shrink-0 text-sm font-semibold text-gray-800 dark:text-gray-100">
            {formatCurrency(trx.total)}
          </span>
        </li>
      ))}
    </ul>
  );
}
