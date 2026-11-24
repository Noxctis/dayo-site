const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});
const shortDate = new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatPeso = (amount) => peso.format(amount);

/** "2026-12-01" -> "Dec 1, 2026" (parsed as local time, not UTC). */
export function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  return shortDate.format(new Date(y, m - 1, d));
}
