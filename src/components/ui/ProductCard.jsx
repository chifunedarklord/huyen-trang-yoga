import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const discount = product.sale_price
    ? Math.round((1 - product.sale_price / product.price) * 100)
    : null

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock_quantity < 1) {
      toast.error('Sản phẩm đã hết hàng')
      return
    }
    addItem(product)
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`)
  }

  const primaryImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : null

  return (
    <article className="product-card card" id={`product-${product.id}`}>
      <Link to={`/san-pham/${product.slug}`} className="product-image-wrap">
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className="product-img" loading="lazy" />
        ) : (
          <div className="product-img-placeholder">
            <span>🧘</span>
          </div>
        )}
        {discount && <span className="product-badge">-{discount}%</span>}
        {product.stock_quantity < 1 && (
          <div className="product-out-of-stock">Hết hàng</div>
        )}
        <button className="product-wishlist" aria-label="Yêu thích" id={`wishlist-${product.id}`}>
          <Heart size={16} />
        </button>
      </Link>

      <div className="card-body product-info">
        {product.product_categories?.name && (
          <span className="product-category">{product.product_categories.name}</span>
        )}
        <Link to={`/san-pham/${product.slug}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">
            {product.sale_price ? (
              <>
                <span className="price-sale">{formatPrice(product.sale_price)}</span>
                <span className="price-original">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="price-sale">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            className="btn btn-primary btn-sm add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock_quantity < 1}
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingCart size={14} />
            Thêm
          </button>
        </div>
      </div>
    </article>
  )
}
