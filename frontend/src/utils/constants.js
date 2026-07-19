export const ROLES = {
  ADMIN: 'admin',
  KASIR: 'kasir',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  QRIS: 'qris',
};

export const STORAGE_KEYS = {
  TOKEN: 'cocomelon_token',
  USER: 'cocomelon_user',
  REMEMBER: 'cocomelon_remember',
  THEME: 'cocomelon_theme',
};

export const TAX_RATE = 0.1; // 10% pajak default, dapat diubah di Settings

export const DATE_FILTERS = [
  { label: 'Harian', value: 'daily' },
  { label: 'Mingguan', value: 'weekly' },
  { label: 'Bulanan', value: 'monthly' },
  { label: 'Kustom', value: 'custom' },
];
