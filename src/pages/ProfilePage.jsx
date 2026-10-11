import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Calendar, ShoppingBag, Clock, MapPin, Phone, CheckCircle, XCircle, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('bookings') // 'bookings', 'orders', 'profile'
  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)

  // Profile Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/dang-nhap')
      return
    }
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setAddress(profile.address || '')
    }
    fetchMyBookings()
    fetchMyOrders()
  }, [user, profile])

  const fetchMyBookings = async () => {
    if (!user) return
    setLoadingBookings(true)
    const { data } = await supabase
      .from('class_bookings')
      .select(`
        id, status, payment_status, created_at, notes,
        class_schedules (
          id, scheduled_date, start_time, end_time, room,
          yoga_classes (name, instructor, price)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setBookings(data)
    setLoadingBookings(false)
  }

  const fetchMyOrders = async () => {
    if (!user) return
    setLoadingOrders(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setOrders(data)
    setLoadingOrders(false)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    const { error } = await updateProfile({
      full_name: fullName,
      phone,
      address
    })
    setSavingProfile(false)
    if (error) {
      toast.error('Không thể cập nhật hồ sơ: ' + error.message)
    } else {
      toast.success('Cập nhật thông tin thành công!')
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch tập này?')) return

    const { error } = await supabase
      .from('class_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    if (error) {
      toast.error('Lỗi khi hủy: ' + error.message)
    } else {
      toast.success('Đã hủy lịch tập thành công')
      fetchMyBookings()
    }
  }

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'delivered': return <span className="status-badge success">Đã giao hàng</span>
      case 'shipping': return <span className="status-badge info">Đang giao</span>
      case 'processing': return <span className="status-badge warning">Đang chuẩn bị</span>
      case 'cancelled': return <span className="status-badge danger">Đã hủy</span>
      default: return <span className="status-badge warning">Đang xử lý</span>
    }
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-avatar">
            {profile?.full_name?.[0]?.toUpperCase() || 'Y'}
          </div>
          <div className="profile-header-info">
            <h1>{profile?.full_name || 'Học viên Yoga'}</h1>
            <p>{user?.email}</p>
            {profile?.phone && <span><Phone size={14} /> {profile.phone}</span>}
          </div>
          <div className="profile-header-actions">
            <button className="btn btn-outline btn-sm" onClick={signOut}>
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={18} /> Lịch Tập Của Tôi ({bookings.length})
          </button>
          <button
            className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} /> Đơn Hàng Của Tôi ({orders.length})
          </button>
          <button
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Thông Tin Cá Nhân
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              {loadingBookings ? (
                <p>Đang tải lịch tập...</p>
              ) : bookings.length === 0 ? (
                <div className="empty-tab">
                  <Calendar size={48} />
                  <h3>Bạn chưa đăng ký ca tập nào</h3>
                  <p>Hãy xem lịch học trong tuần và chọn ca tập phù hợp nhé!</p>
                  <Link to="/lich-hoc" className="btn btn-primary" style={{ marginTop: 16 }}>
                    Xem Lịch Tập Ngay
                  </Link>
                </div>
              ) : (
                <div className="bookings-grid">
                  {bookings.map(b => (
                    <div key={b.id} className="booking-card">
                      <div className="booking-card-header">
                        <div>
                          <h3>{b.class_schedules?.yoga_classes?.name}</h3>
                          <span className="booking-instructor">HLV: {b.class_schedules?.yoga_classes?.instructor}</span>
                        </div>
                        <span className={`status-badge ${b.status === 'confirmed' ? 'info' : b.status === 'attended' ? 'success' : 'danger'}`}>
                          {b.status === 'confirmed' ? 'Đã xác nhận' : b.status === 'attended' ? 'Đã tham gia' : 'Đã hủy'}
                        </span>
                      </div>

                      <div className="booking-card-body">
                        <div className="booking-meta">
                          <Calendar size={16} />
                          <strong>Ngày:</strong> {b.class_schedules?.scheduled_date}
                        </div>
                        <div className="booking-meta">
                          <Clock size={16} />
                          <strong>Giờ:</strong> {b.class_schedules?.start_time?.slice(0, 5)} - {b.class_schedules?.end_time?.slice(0, 5)}
                        </div>
                        <div className="booking-meta">
                          <MapPin size={16} />
                          <strong>Phòng:</strong> {b.class_schedules?.room}
                        </div>
                      </div>

                      <div className="booking-card-footer">
                        <div className="booking-price">
                          {formatPrice(b.class_schedules?.yoga_classes?.price || 0)}
                        </div>
                        {b.status === 'confirmed' && (
                          <button
                            className="btn btn-outline btn-sm text-danger"
                            onClick={() => handleCancelBooking(b.id)}
                          >
                            Hủy đăng ký
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {loadingOrders ? (
                <p>Đang tải đơn hàng...</p>
              ) : orders.length === 0 ? (
                <div className="empty-tab">
                  <ShoppingBag size={48} />
                  <h3>Bạn chưa có đơn mua sắm nào</h3>
                  <p>Khám phá các sản phẩm thảm tập, trang phục yoga cao cấp tại shop.</p>
                  <Link to="/san-pham" className="btn btn-primary" style={{ marginTop: 16 }}>
                    Ghé Thăm Cửa Hàng
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-item-card">
                      <div className="order-item-header">
                        <div>
                          <strong>Mã đơn: #{order.order_number || order.id.slice(0, 8)}</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: 12 }}>
                            {new Date(order.created_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div>{getOrderStatusBadge(order.status)}</div>
                      </div>

                      <div className="order-item-body">
                        <div>
                          <p><strong>Người nhận:</strong> {order.shipping_name} - {order.shipping_phone}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                            <strong>Địa chỉ:</strong> {order.shipping_address}, {order.shipping_ward}, {order.shipping_district}, {order.shipping_province}
                          </p>
                        </div>
                        <div className="order-item-total">
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tổng thanh toán</span>
                          <span className="total-num">{formatPrice(order.total_amount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE FORM */}
          {activeTab === 'profile' && (
            <div className="profile-form-container">
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Email đăng nhập</label>
                  <input
                    type="text"
                    className="form-input"
                    value={user?.email || ''}
                    disabled
                    style={{ background: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label className="form-label">Địa chỉ nhận hàng mặc định</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố"
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                  {savingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
