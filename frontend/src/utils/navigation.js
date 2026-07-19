import {
  HiOutlineSquares2X2,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineChartBar,
  HiOutlineShoppingCart,
  HiOutlineClipboardDocumentList,
  HiOutlineUser,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import { ROLES } from './constants';

export const adminNavigation = [
  { label: 'Dashboard', to: '/dashboard', icon: HiOutlineSquares2X2 },
  { label: 'Produk', to: '/products', icon: HiOutlineCube },
  { label: 'Kategori', to: '/categories', icon: HiOutlineTag },
  { label: 'Laporan', to: '/reports', icon: HiOutlineChartBar },
];

export const kasirNavigation = [
  { label: 'Transaksi POS', to: '/cashier', icon: HiOutlineShoppingCart, end: true },
  { label: 'Riwayat Transaksi', to: '/cashier/riwayat', icon: HiOutlineClipboardDocumentList },
];

export const bottomNavigation = [
  { label: 'Profil', to: '/profile', icon: HiOutlineUser },
];

export const adminBottomNavigation = [
  { label: 'Profil', to: '/profile', icon: HiOutlineUser },
  { label: 'Pengaturan', to: '/settings', icon: HiOutlineCog6Tooth },
];

export function getNavigationForRole(role) {
  if (role === ROLES.KASIR) {
    return { main: kasirNavigation, bottom: bottomNavigation };
  }
  return { main: adminNavigation, bottom: adminBottomNavigation };
}
