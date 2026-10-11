import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown, Leaf } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setUserDropdown(false)
  }

  const navLinks = [
    { to: '/',         label: 'Trang Chủ' },
    { to: '/lich-hoc', label: 'Lịch Lớp Học' },
    { to: '/san-pham', label: 'Sản Phẩm' },
    { to: '/gioi-thieu', label: 'Giới Thiệu' },
    { to: '/lien-he',  label: 'Liên Hệ' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src="/logo.jpg" alt="Yoga Huyền Trang Logo" className="logo-img" />
            <span className="logo-text">Yoga Huyền Trang</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="navbar-links hide-mobile">
            {navLinks.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Cart */}
            <Link to="/gio-hang" className="cart-btn" id="cart-button">
              <ShoppingCart size={20} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>

            {/* User */}
            {user ? (
              <div className="user-menu" id="user-menu">
                <button
                  className="user-btn"
                  onClick={() => setUserDropdown(!userDropdown)}
                  id="user-menu-button"
                >
                  <div className="user-avatar">
                    {profile?.full_name?.[0] || profile?.email?.[0] || 'U'}
                  </div>
                  <span className="hide-mobile user-name">
                    {profile?.full_name?.split(' ').pop() || 'Tài khoản'}
                  </span>
                  <ChevronDown size={14} className={`hide-mobile ${userDropdown ? 'rotate' : ''}`} />
                </button>

                {userDropdown && (
                  <div className="user-dropdown" id="user-dropdown">
                    <div className="dropdown-header">
                      <p className="font-semi">{profile?.full_name}</p>
                      <p className="text-muted" style={{fontSize:'0.8rem'}}>{user.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/tai-khoan" className="dropdown-item" onClick={() => setUserDropdown(false)}>
                      <User size={15} /> Tài khoản của tôi
                    </Link>
                    <Link to="/don-hang" className="dropdown-item" onClick={() => setUserDropdown(false)}>
                      📦 Đơn hàng
                    </Link>
                    <Link to="/lich-da-dat" className="dropdown-item" onClick={() => setUserDropdown(false)}>
                      📅 Lịch đã đặt
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="dropdown-divider" />
                        <Link to="/admin" className="dropdown-item dropdown-admin" onClick={() => setUserDropdown(false)}>
                          <Leaf size={15} /> Quản trị Admin
                        </Link>
                      </>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item dropdown-logout" onClick={handleSignOut} id="logout-btn">
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns hide-mobile">
                <Link to="/dang-nhap" className="btn btn-ghost btn-sm" id="login-btn">Đăng nhập</Link>
                <Link to="/dang-ky" className="btn btn-primary btn-sm" id="register-btn">Đăng ký</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              id="mobile-menu-toggle"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu animate-fade-in" id="mobile-menu">
          <div className="container">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mobile-auth">
                <Link to="/dang-nhap" className="btn btn-secondary btn-full" onClick={() => setMenuOpen(false)}>
                  Đăng nhập
                </Link>
                <Link to="/dang-ky" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
