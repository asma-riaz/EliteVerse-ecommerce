// src/utils/helpers.js
export const formatPrice = (price) =>
  'PKR ' + Number(price).toLocaleString('en-PK')

export const discount = (price, sale) =>
  sale ? Math.round(((price - sale) / price) * 100) : 0

export const truncate = (str, n = 80) =>
  str?.length > n ? str.slice(0, n) + '...' : str

export const orderStatusColor = (status) => ({
  pending:    'badge-pending',
  processing: 'badge-processing',
  shipped:    'badge-shipped',
  delivered:  'badge-delivered',
  cancelled:  'badge-cancelled',
}[status] || 'badge-pending')
