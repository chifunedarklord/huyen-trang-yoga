import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { CheckCircle, CreditCard, Banknote } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatPrice, generateOrderNumber, paymentMethodLabel } from '../utils/helpers'
import toast from 'react-hot-toast'
import './CheckoutPage.css'

const PAYMENT_METHODS = [
  { id: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { id: 'vnpay',         label: 'VNPay',                  icon: '💳' },
  { id: 'momo',          label: 'MoMo',                   icon: '💜' },
  { id: 'zalopay',       label: 'ZaloPay',                icon: '🔵' },
  { id: 'cod',           label: 'Tiền mặt khi nhận hàng', icon: '💵' },
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name:    profile?.full_name || '',
      phone:   profile?.phone || '',
      address: profile?.address || '',
    }
  })

  const shipping = total > 500000 ? 0 : 30000
  const grandTotal = total + shipping

  const onSubmit = async (data) => {
    if (items.length === 0) { toast.error('Giỏ hàng trống'); return }
    setLoading(true)
    const oNumber = generateOrderNumber()

    const { data: order, error } = await supabase.from('orders').insert({
      user_id:          user.id,
      order_number:     oNumber,
      total_amount:     grandTotal,
      shipping_fee:     shipping,
      payment_method:   paymentMethod,
      payment_status:   paymentMethod === 'cod' ? 'pending' : 'pending',
      shipping_name:    data.name,
      shipping_phone:   data.phone,
      shipping_address: `${data.address}, ${data.ward}, ${data.district}, ${data.province}`,
      shipping_province: data.province,
      shipping_district: data.district,
      shipping_ward:     data.ward,
      notes:             data.notes,
      status:            'pending',
    }).select().single()

    if (!error && order) {
      await supabase.from('order_items').insert(
        items.map(item => ({
          order_id:      order.id,
          product_id:    item.id,
          product_name:  item.name,
          product_image: item.images?.[0] || null,
          quantity:      item.quantity,
          unit_price:    item.sale_price || item.price,
          total_price:   (item.sale_price || item.price) * item.quantity,
        }))
      )
      clearCart()
      setOrderNumber(oNumber)
      setSuccess(true)
    } else {
      toast.error('Đặt hàng thất bại. Vui lòng thử lại.')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success" id="order-success">
            <CheckCircle size={72} className="success-icon" />
            <h1>Đặt hàng thành công!</h1>
            <p>Mã đơn hàng của bạn: <strong>#{orderNumber}</strong></p>
            <p className="text-muted">
              {paymentMethod === 'bank_transfer' && 'Vui lòng chuyển khoản theo thông tin bên dưới để hoàn tất đơn hàng.'}
              {paymentMethod === 'cod' && 'Chúng tôi sẽ liên hệ xác nhận và giao hàng tận nơi.'}
              {['vnpay','momo','zalopay'].includes(paymentMethod) && 'Chúng tôi sẽ liên hệ để hướng dẫn thanh toán.'}
            </p>

            {paymentMethod === 'bank_transfer' && (
              <div className="bank-info" id="bank-info">
                <h3>Thông Tin Chuyển Khoản</h3>
                <div className="bank-detail"><span>Ngân hàng:</span><strong>Vietcombank</strong></div>
                <div className="bank-detail"><span>Số tài khoản:</span><strong>0123456789</strong></div>
                <div className="bank-detail"><span>Chủ tài khoản:</span><strong>NGUYEN HUYEN TRANG</strong></div>
                <div className="bank-detail"><span>Nội dung:</span><strong>#{orderNumber}</strong></div>
                <div className="bank-detail"><span>Số tiền:</span><strong className="text-sage">{formatPrice(grandTotal)}</strong></div>
              </div>
            )}

            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/don-hang')} id="view-orders-btn">
                Xem đơn hàng
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/san-pham')} id="continue-btn">
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Thanh Toán</h1>

        <form onSubmit={handleSubmit(onSubmit)} id="checkout-form">
          <div className="checkout-layout">
            {/* Shipping Form */}
            <div className="checkout-left">
              <div className="checkout-section">
                <h3>Thông Tin Giao Hàng</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-name">Họ và tên *</label>
                    <input id="checkout-name" className="form-input" {...register('name', { required: 'Vui lòng nhập họ tên' })} />
                    {errors.name && <span className="form-error">{errors.name.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-phone">Số điện thoại *</label>
                    <input id="checkout-phone" className="form-input" type="tel" {...register('phone', { required: 'Vui lòng nhập SĐT' })} />
                    {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-province">Tỉnh/Thành phố *</label>
                    <input id="checkout-province" className="form-input" placeholder="TP. Hồ Chí Minh" {...register('province', { required: 'Vui lòng nhập tỉnh/thành' })} />
                    {errors.province && <span className="form-error">{errors.province.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-district">Quận/Huyện *</label>
                    <input id="checkout-district" className="form-input" placeholder="Quận 1" {...register('district', { required: 'Vui lòng nhập quận/huyện' })} />
                    {errors.district && <span className="form-error">{errors.district.message}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-ward">Phường/Xã</label>
                  <input id="checkout-ward" className="form-input" placeholder="Phường Bến Nghé" {...register('ward')} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-address">Địa chỉ cụ thể *</label>
                  <input id="checkout-address" className="form-input" placeholder="Số nhà, tên đường..." {...register('address', { required: 'Vui lòng nhập địa chỉ' })} />
                  {errors.address && <span className="form-error">{errors.address.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-notes">Ghi chú</label>
                  <textarea id="checkout-notes" className="form-input" rows={3} placeholder="Ghi chú cho đơn hàng..." {...register('notes')} />
                </div>
              </div>

              {/* Payment */}
              <div className="checkout-section">
                <h3>Phương Thức Thanh Toán</h3>
                <div className="payment-options" id="payment-options">
                  {PAYMENT_METHODS.map(m => (
                    <label
                      key={m.id}
                      className={`payment-option ${paymentMethod === m.id ? 'selected' : ''}`}
                      id={`pay-${m.id}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        style={{display:'none'}}
                      />
                      <span className="pay-icon">{m.icon}</span>
                      <span>{m.label}</span>
                      {paymentMethod === m.id && <span className="pay-check">✓</span>}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="checkout-right">
              <div className="checkout-section">
                <h3>Đơn Hàng ({items.length} sản phẩm)</h3>
                <div className="order-items">
                  {items.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="order-item-img">
                        {item.images?.[0] ? <img src={item.images[0]} alt={item.name} /> : '🧘'}
                      </div>
                      <div className="order-item-info">
                        <p className="font-medium" style={{fontSize:'0.875rem'}}>{item.name}</p>
                        <p className="text-muted" style={{fontSize:'0.78rem'}}>x{item.quantity}</p>
                      </div>
                      <span className="font-semi" style={{fontSize:'0.875rem', color:'var(--sage-600)'}}>
                        {formatPrice((item.sale_price || item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-totals">
                  <div className="summary-row">
                    <span>Tạm tính</span><span>{formatPrice(total)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Giao hàng</span>
                    <span>{shipping === 0 ? <span className="text-sage">Miễn phí</span> : formatPrice(shipping)}</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row" style={{fontWeight:700, fontSize:'1.05rem', color:'var(--text-primary)'}}>
                    <span>Tổng cộng</span>
                    <span className="text-sage">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  disabled={loading}
                  id="place-order-btn"
                >
                  {loading ? <><span className="spinner" style={{width:20,height:20}} /> Đang xử lý...</> : 'Đặt Hàng'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
