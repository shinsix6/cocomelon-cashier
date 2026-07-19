/**
 * Format a number as Indonesian Rupiah currency, e.g. 25000 -> "Rp25.000"
 */
export function formatCurrency(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
}

/**
 * Format a compact currency for dashboard cards, e.g. 4800000 -> "Rp4,8jt"
 */
export function formatCompactCurrency(value) {
  const number = Number(value) || 0;
  if (number >= 1_000_000_000) {
    return `Rp${(number / 1_000_000_000).toFixed(1).replace('.', ',')}M`;
  }
  if (number >= 1_000_000) {
    return `Rp${(number / 1_000_000).toFixed(1).replace('.', ',')}jt`;
  }
  if (number >= 1_000) {
    return `Rp${(number / 1_000).toFixed(0)}rb`;
  }
  return formatCurrency(number);
}

/**
 * Format a plain number with thousands separators.
 */
export function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
}

/**
 * Format a date/time using Indonesian locale.
 * @param {string|Date} date
 * @param {Object} options
 */
export function formatDate(date, options = {}) {
  if (!date) return '-';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(d);
}

export function formatDateTime(date) {
  return formatDate(date, { hour: '2-digit', minute: '2-digit' });
}

export function formatTime(date) {
  if (!date) return '-';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
