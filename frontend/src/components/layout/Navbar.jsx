import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineBars3,
  HiOutlineMagnifyingGlass,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import useAuth from '../../hooks/useAuth';
import useDarkMode from '../../hooks/useDarkMode';
import { cn } from '../../utils/cn';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

export default function Navbar({ onMenuClick, onSearch }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-3 lg:px-6">
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Buka menu"
        >
          <HiOutlineBars3 className="h-5 w-5" />
        </button>
        <div className="relative hidden max-w-xs flex-1 sm:block">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari apa saja..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
          aria-label="Ganti tema"
        >
          {isDark ? <HiOutlineSun className="h-5 w-5" /> : <HiOutlineMoon className="h-5 w-5" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
            aria-label="Notifikasi"
          >
            <HiOutlineBell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl animate-scale-in">
              <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Notifikasi</p>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                <div className="rounded-lg px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                  <p className="font-medium text-gray-700 dark:text-gray-200">Stok produk hampir habis</p>
                  <p className="text-xs text-gray-400">Periksa halaman Produk untuk detail</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative ml-1" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">
                {getInitials(user?.name) || <HiOutlineUser className="h-4 w-4" />}
              </div>
            )}
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                {user?.name || 'Pengguna'}
              </span>
              <span className="block text-xs capitalize text-gray-400">{user?.role}</span>
            </span>
            <HiOutlineChevronDown
              className={cn(
                'hidden h-4 w-4 text-gray-400 transition-transform sm:block',
                dropdownOpen && 'rotate-180'
              )}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl animate-scale-in overflow-hidden">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <HiOutlineUser className="h-4 w-4 text-gray-400" /> Profil Saya
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <HiOutlineCog6Tooth className="h-4 w-4 text-gray-400" /> Pengaturan
                </button>
              )}
              <div className="border-t border-gray-100 dark:border-gray-800" />
              <button
                onClick={logout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <HiOutlineArrowRightOnRectangle className="h-4 w-4" /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
