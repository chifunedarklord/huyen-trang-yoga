import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/admin/AdminLayout'

// Public Pages
import HomePage from './pages/HomePage'
import SchedulePage from './pages/SchedulePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import ProfilePage from './pages/ProfilePage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminClasses from './pages/admin/AdminClasses'
import AdminSchedules from './pages/admin/AdminSchedules'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/AdminSettings'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PublicLayout({ children }) {
  return (
    <div className="site-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/lich-hoc" element={<PublicLayout><SchedulePage /></PublicLayout>} />
          <Route path="/san-pham" element={<PublicLayout><ShopPage /></PublicLayout>} />
          <Route path="/san-pham/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/gio-hang" element={<PublicLayout><CartPage /></PublicLayout>} />
          <Route path="/thanh-toan" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
          <Route path="/gioi-thieu" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/lien-he" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/tai-khoan" element={<PublicLayout><ProfilePage /></PublicLayout>} />
          <Route path="/don-hang" element={<PublicLayout><ProfilePage /></PublicLayout>} />
          <Route path="/lich-da-dat" element={<PublicLayout><ProfilePage /></PublicLayout>} />

          {/* Auth Routes */}
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route path="/dang-ky" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/lop-hoc" element={<AdminLayout><AdminClasses /></AdminLayout>} />
          <Route path="/admin/lich-hoc" element={<AdminLayout><AdminSchedules /></AdminLayout>} />
          <Route path="/admin/san-pham" element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/don-hang" element={<AdminLayout><AdminOrders /></AdminLayout>} />
          <Route path="/admin/dat-lich" element={<AdminLayout><AdminBookings /></AdminLayout>} />
          <Route path="/admin/nguoi-dung" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/cai-dat" element={<AdminLayout><AdminSettings /></AdminLayout>} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
