import { useEffect, useMemo, useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineReceiptPercent, HiOutlineEye } from 'react-icons/hi2';
import useTransactions from '../../hooks/useTransactions';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/tables/Pagination';
import { SkeletonTableRow } from '../../components/loading/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import ReceiptModal from './components/ReceiptModal';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function TransactionHistory() {
  const { transactions, loading, error, fetchTransactions } = useTransactions();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const limit = 10;

  useEffect(() => {
    fetchTransactions({ search: debouncedSearch, page, limit });
  }, [fetchTransactions, debouncedSearch, page]);

  const totalPages = Math.max(1, Math.ceil((transactions.length || 0) / limit) || 1);

  const rows = useMemo(() => transactions, [transactions]);

  return (
    <div>
      <PageHeader title="Riwayat Transaksi" description="Daftar transaksi yang telah Anda proses" />

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800 p-4">
          <div className="relative max-w-sm">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nomor invoice..."
              className="input-base pl-9"
            />
          </div>
        </div>

        {error ? (
          <div className="p-4">
            <ErrorState onRetry={() => fetchTransactions({ search: debouncedSearch, page, limit })} />
          </div>
        ) : !loading && rows.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={HiOutlineReceiptPercent}
              title="Belum ada transaksi"
              description="Transaksi yang Anda proses akan muncul di sini."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Metode</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} columns={5} />)
                  : rows.map((trx) => {
                      const id = trx._id ?? trx.id;
                      return (
                        <tr key={id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                            {trx.invoiceNumber || `INV-${id?.toString().slice(-6)}`}
                          </td>
                          <td className="px-4 py-3 text-gray-500">{formatDateTime(trx.createdAt)}</td>
                          <td className="px-4 py-3">
                            <Badge tone={trx.paymentMethod === 'cash' ? 'success' : 'info'}>
                              {(trx.paymentMethod || '-').toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">
                            {formatCurrency(trx.total)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelected(trx)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-800"
                              title="Lihat Struk"
                            >
                              <HiOutlineEye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && rows.length > 0 && (
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={totalPages} total={rows.length} limit={limit} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <ReceiptModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        transaction={selected}
        cashierName={selected?.cashierName || user?.name}
      />
    </div>
  );
}
