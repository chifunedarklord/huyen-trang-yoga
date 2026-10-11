import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Star, Shield, Truck, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ClassCard from '../components/ui/ClassCard'
import ProductCard from '../components/ui/ProductCard'
import './HomePage.css'

export default function HomePage() {
  const [classes, setClasses] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [classRes, productRes] = await Promise.all([
      supabase.from('yoga_classes').select('*').eq('is_active', true).limit(4),
      supabase.from('products')
        .select('*, product_categories(name)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(4),
    ])
    setClasses(classRes.data || [])
    setProducts(productRes.data || [])
    setLoading(false)
  }

  const stats = [
    { number: '500+', label: 'Học viên' },
    { number: '4', label: 'Lớp học' },
    { number: '5+', label: 'Năm kinh nghiệm' },
    { number: '98%', label: 'Hài lòng' },
  ]

  const benefits = [
    {
      icon: '🌿',
      title: 'Thiên Nhiên & Thuần Khiết',
      desc: 'Không gian tập luyện trong lành, tràn đầy cây xanh, giúp bạn thư giãn tâm trí tuyệt vời.',
    },
    {
      icon: '💪',
      title: 'Chuyên Gia Giàu Kinh Nghiệm',
      desc: 'HLV Huyền Trang với hơn 5 năm kinh nghiệm, được chứng chỉ quốc tế RYT-200.',
    },
    {
      icon: '📅',
      title: 'Lịch Học Linh Hoạt',
      desc: 'Đặt lịch trực tuyến dễ dàng, nhiều khung giờ sáng - chiều - tối phù hợp mọi lịch trình.',
    },
    {
      icon: '🛍️',
      title: 'Phụ Kiện Chất Lượng',
      desc: 'Cửa hàng thảm yoga và phụ kiện cao cấp, được chọn lọc kỹ lưỡng cho người tập.',
    },
  ]

  const testimonials = [
    {
      name: 'Nguyễn Minh Anh',
      text: 'Sau 3 tháng tập cùng cô Huyền Trang, tôi cảm thấy sức khỏe cải thiện rõ rệt. Không gian lớp học rất dễ chịu và thân thiện!',
      rating: 5,
      avatar: 'M',
    },
    {
      name: 'Trần Thị Bích',
      text: 'Mua thảm yoga trên web, giao hàng nhanh, chất lượng tuyệt vời. Đặt lịch online cũng rất tiện lợi!',
      rating: 5,
      avatar: 'B',
    },
    {
      name: 'Lê Hoàng Nam',
      text: 'Ban đầu tôi chưa biết gì về yoga, nhưng lớp cơ bản của cô Huyền Trang rất dễ tiếp cận. Giờ tôi đã lên trung cấp rồi!',
      rating: 5,
      avatar: 'N',
    },
  ]

  return (
    <div className="homepage">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-circle hero-circle-1" />
          <div className="hero-circle hero-circle-2" />
          <div className="hero-leaf hero-leaf-1">🌿</div>
          <div className="hero-leaf hero-leaf-2">🌱</div>
          <div className="hero-leaf hero-leaf-3">☘️</div>
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Leaf size={14} />
              <span>Yoga Huyền Trang</span>
            </div>
            <h1 className="hero-title">
              Cân Bằng Thân Tâm
              <br />
              <em>Sống Trọn Vẹn Hơn</em>
            </h1>
            <p className="hero-subtitle">
              Hành trình yoga của bạn bắt đầu từ đây — đặt lịch lớp học, mua sắm phụ kiện chất lượng,
              và trải nghiệm sự thay đổi từ bên trong.
            </p>
            <div className="hero-actions">
              <Link to="/lich-hoc" className="btn btn-primary btn-lg" id="hero-book-btn">
                Đặt Lịch Ngay <ArrowRight size={18} />
              </Link>
              <Link to="/san-pham" className="btn btn-secondary btn-lg" id="hero-shop-btn">
                Khám Phá Sản Phẩm
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <ChevronDown size={20} className="animate-float" />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-number">{s.number}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="section benefits-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Tại sao chọn chúng tôi</span>
            <h2>Trải Nghiệm Yoga Khác Biệt</h2>
            <p className="section-desc">
              Chúng tôi mang đến không gian tập luyện tự nhiên, ấm áp và chuyên nghiệp nhất.
            </p>
          </div>
          <div className="benefits-grid">
            {benefits.map((b, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-icon">{b.icon}</div>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLASSES ===== */}
      <section className="section classes-section">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <span className="section-tag">Lớp học</span>
              <h2>Các Lớp Yoga Của Chúng Tôi</h2>
            </div>
            <Link to="/lich-hoc" className="btn btn-secondary" id="view-all-classes-btn">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{height: 200}}>
              <div className="spinner" />
            </div>
          ) : classes.length > 0 ? (
            <div className="classes-grid">
              {classes.map(c => <ClassCard key={c.id} yogaClass={c} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>Chưa có lớp học nào. Vui lòng quay lại sau!</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className="section products-section">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <span className="section-tag">Cửa hàng</span>
              <h2>Sản Phẩm Nổi Bật</h2>
            </div>
            <Link to="/san-pham" className="btn btn-secondary" id="view-all-products-btn">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{height: 200}}>
              <div className="spinner" />
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>Chưa có sản phẩm nổi bật. Vui lòng quay lại sau!</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Đánh giá</span>
            <h2>Học Viên Nói Gì</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card card">
                <div className="card-body">
                  <div className="testimonial-stars">
                    {Array(t.rating).fill(0).map((_, j) => (
                      <Star key={j} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.avatar}</div>
                    <strong>{t.name}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services-strip">
        <div className="container">
          <div className="services-grid">
            <div className="service-item">
              <Shield size={22} />
              <div>
                <strong>Bảo Hành Sản Phẩm</strong>
                <span>Đổi trả trong 30 ngày</span>
              </div>
            </div>
            <div className="service-item">
              <Truck size={22} />
              <div>
                <strong>Giao Hàng Toàn Quốc</strong>
                <span>Nhanh chóng &amp; tiết kiệm</span>
              </div>
            </div>
            <div className="service-item">
              <Star size={22} />
              <div>
                <strong>Chất Lượng Cao Cấp</strong>
                <span>Sản phẩm được chọn lọc kỹ</span>
              </div>
            </div>
            <div className="service-item">
              <Leaf size={22} />
              <div>
                <strong>Thân Thiện Môi Trường</strong>
                <span>Vật liệu tự nhiên, bền vững</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <span className="section-tag" style={{color:'var(--sage-200)'}}>Bắt đầu ngay hôm nay</span>
              <h2 style={{color:'white'}}>Sẵn Sàng Cho Hành Trình Yoga?</h2>
              <p style={{color:'var(--sage-200)'}}>
                Đăng ký tài khoản, đặt lịch lớp học đầu tiên và nhận ưu đãi chào mừng thành viên mới!
              </p>
              <div className="hero-actions">
                <Link to="/dang-ky" className="btn btn-lg" style={{background:'white', color:'var(--sage-700)'}} id="cta-signup-btn">
                  Đăng Ký Miễn Phí <ArrowRight size={18} />
                </Link>
                <Link to="/lich-hoc" className="btn btn-secondary btn-lg" style={{borderColor:'rgba(255,255,255,0.4)', color:'white'}} id="cta-schedule-btn">
                  Xem Lịch Học
                </Link>
              </div>
            </div>
            <div className="cta-decoration">🧘‍♀️</div>
          </div>
        </div>
      </section>
    </div>
  )
}
