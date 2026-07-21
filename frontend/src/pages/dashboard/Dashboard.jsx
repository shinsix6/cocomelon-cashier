import { useCallback, useEffect, useState } from 'react';
import {
  HiOutlineShoppingBag,
  HiOutlineBanknotes,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineExclamationTriangle,
  HiOutlineReceiptPercent,
} from 'react-icons/hi2';
import reportService from '../../services/reportService';
import transactionService from '../../services/transactionService';
import PageHeader from '../../components/ui/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import { SkeletonCard, Skeleton } from '../../components/loading/Skeleton';
import { ErrorState } from '../../components/ui/EmptyState';
import DailySalesChart from '../../components/charts/DailySalesChart';
import MonthlySalesChart from '../../components/charts/MonthlySalesChart';
import RecentTransactionsList from '../../components/tables/RecentTransactionsList';
import { formatCompactCurrency, formatNumber } from '../../utils/format';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, recentRes] = await Promise.all([
        reportService.getDashboardSummary(),
        transactionService.getRecent(5),
      ]);
      setSummary(summaryRes.data);
      const recentData = recentRes.data;
      setRecentTransactions(recentData.items ?? recentData.data ?? recentData ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Ringkasan performa toko Anda hari ini" />
        <ErrorState
          description="Tidak dapat memuat data dashboard. Pastikan Backend API sudah berjalan."
          onRetry={loadDashboard}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="Ringkasan performa toko Anda hari ini" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Penjualan Hari Ini"
              value={formatNumber(summary?.todaySales ?? 0)}
              icon={HiOutlineShoppingBag}
              color="emerald"
            />
            <StatCard
              label="Total Pendapatan"
              value={formatCompactCurrency(summary?.todayRevenue ?? 0)}
              icon={HiOutlineBanknotes}
              color="blue"
            />
            <StatCard
              label="Jumlah Transaksi"
              value={formatNumber(summary?.totalTransactions ?? 0)}
              icon={HiOutlineReceiptPercent}
              color="purple"
            />
            <StatCard
              label="Jumlah Produk"
              value={formatNumber(summary?.totalProducts ?? 0)}
              icon={HiOutlineCube}
              color="amber"
            />
            <StatCard
              label="Jumlah Customer"
              value={formatNumber(summary?.totalCustomers ?? 0)}
              icon={HiOutlineUsers}
              color="gray"
            />
            <StatCard
              label="Produk Hampir Habis"
              value={formatNumber(summary?.lowStockCount ?? 0)}
              icon={HiOutlineExclamationTriangle}
              color="red"
            />
          </>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">
            Grafik Penjualan Harian
          </h3>
          {loading ? (
            <Skeleton className="mt-4 h-64 w-full" />
          ) : (
            <DailySalesChart data={summary?.dailySales ?? []} />
          )}
        </Card>
        <Card>
          <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">
            Grafik Penjualan Bulanan
          </h3>
          {loading ? (
            <Skeleton className="mt-4 h-64 w-full" />
          ) : (
            <MonthlySalesChart data={summary?.monthlySales ?? []} />
          )}
        </Card>
      </div>

      <Card className="mt-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">
            Transaksi Terbaru
          </h3>
        </div>
        {loading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <RecentTransactionsList transactions={recentTransactions} />
        )}
      </Card>
    </div>
  );
}
