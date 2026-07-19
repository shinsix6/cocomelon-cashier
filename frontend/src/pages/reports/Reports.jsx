import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineDocumentText,
  HiOutlineArrowDownTray,
  HiOutlinePrinter,
  HiOutlineBanknotes,
  HiOutlineReceiptPercent,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import reportService from '../../services/reportService';
import useDebounce from '../../hooks/useDebounce';
import PageHeader from '../../components/ui/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/tables/Pagination';
import { SkeletonCard, SkeletonTableRow, Skeleton } from '../../components/loading/Skeleton';
import { ErrorState, EmptyState } from '../../components/ui/EmptyState';
import DailySalesChart from '../../components/charts/DailySalesChart';
import TopProductsChart from '../../components/charts/TopProductsChart';
import { DATE_FILTERS } from '../../utils/constants';
import { formatCurrency, formatCompactCurrency, formatNumber, formatDateTime } from '../../utils/format';
import { cn } from '../../utils/cn';

export default function Reports() {
  const [period, setPeriod] = useState('monthly');
  const [customRange, setCustomRange] = useState({ from: '', to: '' });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(null);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { period, search: debouncedSearch, page, limit, ...customRange };
      const response = await reportService.getByRange(params);
      setReport(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, debouncedSearch, page, customRange.from, customRange.to]);

  const transactions = report?.transactions ?? report?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((transactions.length || 0) / limit) || 1);

  const handleExport = async (type) => {
    setExporting(type);
    try {
      const params = { period, ...customRange };
      const response =
        type === 'pdf' ? await reportService.exportPdf(params) : await reportService.exportExcel(params);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `laporan-penjualan.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Laporan berhasil diekspor ke ${type.toUpperCase()}`);
    } catch (err) {
      toast.error(err.message || 'Gagal mengekspor laporan');
    } finally {
      setExporting(null);
    }
  };

  const topProducts = useMemo(() => report?.topProducts ?? [], [report]);
  const trend = useMemo(() => report?.trend ?? [], [report]);

  return (
    <div>
      <PageHeader
        title="Laporan Penjualan"
        description="Pantau performa keuangan toko dan unduh laporan berkala"
        actions={
          <>
            <Button
              variant="secondary"
              icon={HiOutlineDocumentText}
              loading={exporting === 'pdf'}
              onClick={() => handleExport('pdf')}
            >
              PDF
            </Button>
            <Button
              variant="secondary"
              icon={HiOutlineArrowDownTray}
              loading={exporting === 'excel'}
              onClick={() => handleExport('excel')}
            >
              Excel
            </Button>
            <Button variant="secondary" icon={HiOutlinePrinter} onClick={() => window.print()}>
              Cetak
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {DATE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => {
              setPeriod(filter.value);
              setPage(1);
            }}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              period === filter.value
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            )}
          >
            {filter.label}
          </button>
        ))}
        {period === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customRange.from}
              onChange={(e) => setCustomRange((r) => ({ ...r, from: e.target.value }))}
              className="input-base"
            />
            <span className="text-gray-400">—</span>
            <input
              type="date"
              value={customRange.to}
              onChange={(e) => setCustomRange((r) => ({ ...r, to: e.target.value }))}
              className="input-base"
            />
          </div>
        )}
      </div>

      {error ? (
        <ErrorState onRetry={loadReport} description="Tidak dapat memuat laporan. Pastikan Backend API sudah berjalan." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatCard
                  label="Total Pendapatan"
                  value={formatCompactCurrency(report?.totalRevenue ?? 0)}
                  icon={HiOutlineBanknotes}
                  color="emerald"
                />
                <StatCard
                  label="Jumlah Transaksi"
                  value={formatNumber(report?.totalTransactions ?? 0)}
                  icon={HiOutlineReceiptPercent}
                  color="purple"
                />
                <StatCard
                  label="Rata-rata Order"
                  value={formatCurrency(report?.averageOrder ?? 0)}
                  icon={HiOutlineChartBar}
                  color="blue"
                />
                <StatCard
                  label="Pelanggan Baru"
                  value={formatNumber(report?.newCustomers ?? 0)}
                  icon={HiOutlineUsers}
                  color="amber"
                />
              </>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card>
              <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">
                Tren Pendapatan
              </h3>
              {loading ? <Skeleton className="mt-4 h-64 w-full" /> : <DailySalesChart data={trend} />}
            </Card>
            <Card>
              <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">
                Produk Terlaris
              </h3>
              {loading ? (
                <Skeleton className="mt-4 h-64 w-full" />
              ) : topProducts.length === 0 ? (
                <EmptyState title="Belum ada data penjualan" description="Data produk terlaris akan muncul di sini." />
              ) : (
                <TopProductsChart data={topProducts} />
              )}
            </Card>
          </div>

          <Card className="mt-5 p-0 overflow-hidden">
            <div className="border-b border-gray-100 dark:border-gray-800 p-4">
              <div className="relative max-w-sm">
                <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari transaksi..."
                  className="input-base pl-9"
                />
              </div>
            </div>

            {!loading && transactions.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={HiOutlineReceiptPercent}
                  title="Tidak ada transaksi"
                  description="Belum ada transaksi pada rentang waktu ini."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wide text-gray-400">
                      <th className="px-4 py-3">Invoice</th>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3">Kasir</th>
                      <th className="px-4 py-3">Metode</th>
                      <th className="px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {loading
                      ? Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} columns={5} />)
                      : transactions.map((trx) => (
                          <tr key={trx._id ?? trx.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                              {trx.invoiceNumber || `INV-${(trx._id ?? trx.id ?? '').toString().slice(-6)}`}
                            </td>
                            <td className="px-4 py-3 text-gray-500">{formatDateTime(trx.createdAt)}</td>
                            <td className="px-4 py-3 text-gray-500">{trx.cashierName || trx.cashier?.name || '-'}</td>
                            <td className="px-4 py-3 uppercase text-gray-500">{trx.paymentMethod}</td>
                            <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">
                              {formatCurrency(trx.total)}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && transactions.length > 0 && (
              <div className="px-4 pb-4">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={transactions.length}
                  limit={limit}
                  onPageChange={setPage}
                />
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
