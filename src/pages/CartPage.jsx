import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice } from '../utils/helpers'
import './CartPage.css'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const shipping = total > 500000 ? 0 : 30000

  const handleCheckout = () => {
    if (!user) {
      navigate('/dang-nhap?redirect=/thanh-toan')
    } else {
      navigate('/thanh-toan')
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <ShoppingBag size={64} />
            <h2>Giỏ hàng trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link to="/san-pham" className="btn btn-primary btn-lg" id="continue-shopping">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Giỏ Hàng</h1>
          <button className="btn btn-ghost btn-sm" onClick={clearCart} id="clear-cart">
            <Trash2 size={14} /> Xóa tất cả
          </button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                <div className="item-image">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} />
                  ) : (
                    <div className="item-img-placeholder">🧘</div>
                  )}
                </div>

                <div className="item-info">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-price">{formatPrice(item.sale_price || item.price)}</p>
                </div>

                <div className="item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    id={`decrease-${item.id}`}
                  >−</button>
                  <span>{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    id={`increase-${item.id}`}
                  >+</button>
                </div>

                <div className="item-total">
                  {formatPrice((item.sale_price || item.price) * item.quantity)}
                </div>

                <button
                  className="item-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label="Xóa sản phẩm"
                  id={`remove-${item.id}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Tóm Tắt Đơn Hàng</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Tạm tính ({items.reduce((s,i)=>s+i.quantity,0)} sản phẩm)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span>Phí giao hàng</span>
                <span>{shipping === 0 ? <span className="text-sage">Miễn phí</span> : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <div className="free-shipping-hint">
                  <Tag size={12} />
                  Thêm {formatPrice(500000 - total)} để được miễn phí giao hàng
                </div>
              )}
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <strong>Tổng cộng</strong>
                <strong className="text-sage">{formatPrice(total + shipping)}</strong>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={handleCheckout}
              id="checkout-btn"
            >
              Thanh Toán <ArrowRight size={18} />
            </button>
            <Link to="/san-pham" className="btn btn-ghost btn-full" id="continue-shopping-2">
              ← Tiếp tục mua sắm
            </Link>

            <div className="payment-methods">
              <p>Chấp nhận thanh toán:</p>
              <div className="payment-icons">
                <span className="pay-badge">Ngân hàng</span>
                <span className="pay-badge">VNPay</span>
                <span className="pay-badge">MoMo</span>
                <span className="pay-badge">ZaloPay</span>
                <span className="pay-badge">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
