import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.jpg" alt="Yoga Huyền Trang" />
              <span>Yoga Huyền Trang</span>
            </div>
            <p className="footer-tagline">
              Hành trình cân bằng thân tâm — nơi bạn tìm lại chính mình qua từng hơi thở và tư thế yoga.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook" id="footer-facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram" id="footer-instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-section">
            <h4>Khám Phá</h4>
            <ul>
              <li><Link to="/lich-hoc">Lịch Lớp Học</Link></li>
              <li><Link to="/san-pham">Sản Phẩm</Link></li>
              <li><Link to="/gioi-thieu">Giới Thiệu</Link></li>
              <li><Link to="/lien-he">Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-section">
            <h4>Tài Khoản</h4>
            <ul>
              <li><Link to="/dang-nhap">Đăng Nhập</Link></li>
              <li><Link to="/dang-ky">Đăng Ký</Link></li>
              <li><Link to="/don-hang">Đơn Hàng Của Tôi</Link></li>
              <li><Link to="/lich-da-dat">Lịch Đã Đặt</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Liên Hệ</h4>
            <ul className="contact-list">
              <li>
                <MapPin size={15} />
                <span>123 Đường Yoga, Q.1, TP.HCM</span>
              </li>
              <li>
                <Phone size={15} />
                <a href="tel:0901234567">0901 234 567</a>
              </li>
              <li>
                <Mail size={15} />
                <a href="mailto:info@yogahuyentrang.com">info@yogahuyentrang.com</a>
              </li>
              <li>
                <Clock size={15} />
                <span>T2–CN: 6:00 – 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Yoga Huyền Trang. Bảo lưu mọi quyền.</p>
          <div className="footer-bottom-links">
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
