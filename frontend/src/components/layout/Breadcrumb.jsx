import { Link, useLocation } from 'react-router-dom';
import { HiOutlineChevronRight, HiOutlineHome } from 'react-icons/hi2';

const labelMap = {
  dashboard: 'Dashboard',
  products: 'Produk',
  categories: 'Kategori',
  cashier: 'Transaksi POS',
  riwayat: 'Riwayat Transaksi',
  reports: 'Laporan',
  profile: 'Profil',
  settings: 'Pengaturan',
};

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="mb-1 flex items-center gap-1.5 text-sm text-gray-400" aria-label="Breadcrumb">
      <Link to="/dashboard" className="flex items-center hover:text-brand-600 transition">
        <HiOutlineHome className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const label = labelMap[segment] || segment;
        return (
          <span key={path} className="flex items-center gap-1.5">
            <HiOutlineChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
            {isLast ? (
              <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
            ) : (
              <Link to={path} className="hover:text-brand-600 transition">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
