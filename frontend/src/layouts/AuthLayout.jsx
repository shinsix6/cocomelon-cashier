import { Outlet } from 'react-router-dom';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-emerald-25 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 px-4 py-10">
      {/* Ambient decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/10" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-600/10" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center animate-slide-up">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <HiOutlineShoppingBag className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Cocomelon <span className="text-brand-600">WEB</span>
        </h1>
        <p className="mb-6 mt-1 text-sm text-gray-500 dark:text-gray-400">
          Sistem Kasir &amp; Manajemen Toko
        </p>

        <div className="w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 shadow-xl shadow-gray-200/50 dark:shadow-none">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
