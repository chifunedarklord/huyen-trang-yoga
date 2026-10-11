// Format tiền VND
export const formatPrice = (price) => {
  if (!price && price !== 0) return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)
}

// Format ngày tháng
export const formatDate = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(date))
}

// Format ngày đầy đủ
export const formatDateFull = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(date))
}

// Format thời gian
export const formatTime = (time) => {
  if (!time) return ''
  const [h, m] = time.split(':')
  return `${h}:${m}`
}

// Slug generator
export const toSlug = (str) =>
  str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')

// Level yoga
export const levelLabel = {
  beginner:     'Cơ bản',
  intermediate: 'Trung cấp',
  advanced:     'Nâng cao',
  all:          'Mọi trình độ',
}

// Order status
export const orderStatusLabel = {
  pending:    'Chờ xác nhận',
  confirmed:  'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping:   'Đang giao',
  delivered:  'Đã giao',
  cancelled:  'Đã hủy',
  refunded:   'Đã hoàn tiền',
}

export const orderStatusColor = {
  pending:    'badge-warning',
  confirmed:  'badge-info',
  processing: 'badge-info',
  shipping:   'badge-info',
  delivered:  'badge-success',
  cancelled:  'badge-error',
  refunded:   'badge-earth',
}

// Payment method
export const paymentMethodLabel = {
  bank_transfer: 'Chuyển khoản ngân hàng',
  vnpay:         'VNPay',
  momo:          'MoMo',
  zalopay:       'ZaloPay',
  cod:           'Thanh toán khi nhận hàng',
}

// Generate order number
export const generateOrderNumber = () => {
  const now = new Date()
  const date = now.toISOString().slice(0,10).replace(/-/g,'')
  const rand = Math.random().toString(36).substring(2,6).toUpperCase()
  return `YHT${date}${rand}`
}
