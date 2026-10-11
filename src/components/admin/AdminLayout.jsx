import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, Calendar, ShoppingBag, Users,
  Settings, LogOut, ChevronRight, Menu, X, Leaf
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import './AdminLayout.css'

const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard',       icon: LayoutDashboard, exact: true },
  { to: '/admin/lop-hoc',  label: 'Lớp Học',          icon: Calendar },
  { to: '/admin/lich-hoc', label: 'Lịch Giảng Dạy',   icon: Calendar },
  { to: '/admin/san-pham', label: 'Sản Phẩm',          icon: Package },
  { to: '/admin/don-hang', label: 'Đơn Hàng',          icon: ShoppingBag },
  { to: '/admin/dat-lich', label: 'Đặt Lịch',          icon: Calendar },
  { to: '/admin/nguoi-dung', label: 'Người Dùng',      icon: Users },
  { to: '/admin/cai-dat',  label: 'Cài Đặt',           icon: Settings },
]

export default function AdminLayout({ children }) {
  const { profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!isAdmin) { navigate('/'); toast.error('Bạn không có quyền truy cập trang quản trị') }
  }, [isAdmin])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to
    return location.pathname.startsWith(item.to)
  }

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar" id="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="admin-brand">
            <img src="/logo.jpg" alt="Logo" className="admin-logo" />
            {sidebarOpen && <span>Yoga Huyền Trang</span>}
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            id="sidebar-toggle"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${isActive(item) ? 'active' : ''}`}
              id={`nav-${item.to.replace(/\//g, '-')}`}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="admin-profile">
              <div className="admin-avatar">
                {profile?.full_name?.[0] || 'A'}
              </div>
              <div>
                <p className="admin-name">{profile?.full_name}</p>
                <p className="admin-role">Quản trị viên</p>
              </div>
            </div>
          )}
          <button
            className="sidebar-link logout-btn"
            onClick={handleSignOut}
            id="admin-logout"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
