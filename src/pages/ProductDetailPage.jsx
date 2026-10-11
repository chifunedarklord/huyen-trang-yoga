import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Package, Shield, Truck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'
import ProductCard from '../components/ui/ProductCard'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*, product_categories(name)')
      .eq('slug', slug)
      .single()
    setProduct(data)

    if (data) {
      const { data: rel } = await supabase
        .from('products')
        .select('*, product_categories(name)')
        .eq('category_id', data.category_id)
        .neq('id', data.id)
        .eq('is_active', true)
        .limit(4)
      setRelated(rel || [])
    }
    setLoading(false)
  }

  const handleAddToCart = () => {
    if (product.stock_quantity < qty) {
      toast.error('Số lượng trong kho không đủ')
      return
    }
    addItem(product, qty)
    toast.success(`Đã thêm ${qty} "${product.name}" vào giỏ hàng`)
  }

  if (loading) return (
    <div className="flex-center" style={{minHeight:'60vh'}}>
      <div className="spinner" />
    </div>
  )

  if (!product) return (
    <div className="flex-center flex-col" style={{minHeight:'60vh', gap:16}}>
      <h2>Không tìm thấy sản phẩm</h2>
      <Link to="/san-pham" className="btn btn-primary">← Quay lại cửa hàng</Link>
    </div>
  )

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : []
  const discount = product.sale_price
    ? Math.round((1 - product.sale_price / product.price) * 100) : null

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" id="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/san-pham">Sản phẩm</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Main */}
        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-images">
            <div className="main-image">
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={product.name} id="main-product-image" />
              ) : (
                <div className="img-placeholder">🧘</div>
              )}
              {discount && <span className="product-badge">-{discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    id={`thumb-${i}`}
                  >
                    <img src={img} alt={`${product.name} ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            {product.product_categories?.name && (
              <span className="product-category">{product.product_categories.name}</span>
            )}
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-price">
              {product.sale_price ? (
                <>
                  <span className="price-current">{formatPrice(product.sale_price)}</span>
                  <span className="price-old">{formatPrice(product.price)}</span>
                  <span className="price-discount">Tiết kiệm {discount}%</span>
                </>
              ) : (
                <span className="price-current">{formatPrice(product.price)}</span>
              )}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            <div className="stock-info">
              <Package size={15} />
              <span>
                {product.stock_quantity > 0
                  ? `Còn ${product.stock_quantity} sản phẩm`
                  : 'Hết hàng'}
              </span>
            </div>

            {/* Quantity */}
            <div className="qty-section">
              <label className="form-label">Số lượng</label>
              <div className="qty-control" id="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  id="qty-decrease"
                >−</button>
                <span className="qty-value">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}
                  id="qty-increase"
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="product-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock_quantity < 1}
                id="add-to-cart-detail"
              >
                <ShoppingCart size={18} />
                Thêm vào giỏ hàng
              </button>
              <Link to="/gio-hang" className="btn btn-secondary btn-lg" id="buy-now">
                Mua ngay
              </Link>
            </div>

            {/* Services */}
            <div className="product-services">
              <div className="service-tag">
                <Shield size={14} /> Đổi trả 30 ngày
              </div>
              <div className="service-tag">
                <Truck size={14} /> Giao hàng toàn quốc
              </div>
              <div className="service-tag">
                <Star size={14} /> Chất lượng đảm bảo
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="related-section">
            <h2>Sản Phẩm Liên Quan</h2>
            <div className="products-grid-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
