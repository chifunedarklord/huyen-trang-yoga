import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Users, Calendar, ShoppingBag, Plus,
  ArrowRight, Clock, CheckCircle, AlertCircle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils/helpers'
import './AdminShared.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    todayBookings: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [todaySchedules, setTodaySchedules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Orders count & revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at, shipping_name, order_number')
        .order('created_at', { ascending: false })

      if (orders) {
        const rev = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          revenue: rev
        }))
        setRecentOrders(orders.slice(0, 5))
      }

      // 2. Fetch Bookings count
      const { count: bookingsCount } = await supabase
        .from('class_bookings')
        .select('*', { count: 'exact', head: true })
      
      setStats(prev => ({ ...prev, totalBookings: bookingsCount || 0 }))

      // 3. Fetch Users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      setStats(prev => ({ ...prev, totalUsers: usersCount || 0 }))

      // 4. Fetch today's schedules
      const today = new Date().toISOString().split('T')[0]
      const { data: schedules } = await supabase
        .from('class_schedules')
        .select(`
          id, scheduled_date, start_time, end_time, room,
          yoga_classes (name, instructor, capacity)
        `)
        .eq('scheduled_date', today)
        .order('start_time', { ascending: true })

      if (schedules) {
        setTodaySchedules(schedules)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered': return <span className="badge badge-success">Đã giao</span>
      case 'shipping': return <span className="badge badge-info">Đang giao</span>
      case 'confirmed': return <span className="badge badge-info">Đã duyệt</span>
      case 'processing': return <span className="badge badge-warning">Đang xử lý</span>
      case 'cancelled': return <span className="badge badge-danger">Đã hủy</span>
      default: return <span className="badge badge-warning">Chờ xử lý</span>
    }
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Tổng Quan Quản Trị</h1>
          <p>Chào mừng trở lại! Dưới đây là hoạt động hôm nay của Yoga Huyền Trang.</p>
        </div>
        <div className="admin-actions">
          <Link to="/admin/lich-hoc" className="btn btn-outline btn-sm">
            <Plus size={16} /> Thêm ca học
          </Link>
          <Link to="/admin/san-pham" className="btn btn-primary btn-sm">
            <Plus size={16} /> Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{formatPrice(stats.revenue)}</div>
            <div className="stat-label">Tổng doanh thu bán hàng</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Đơn hàng mua sắm</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">Lượt đặt lịch tập</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Khách hàng & Học viên</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-2xl)' }}>
        {/* Recent Orders */}
        <div className="admin-table-container" style={{ padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Đơn Hàng Gần Đây</h2>
            <Link to="/admin/don-hang" style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="empty-state">Chưa có đơn hàng nào.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.order_number || order.id.slice(0, 8)}</td>
                    <td>{order.shipping_name || 'Khách vãng lai'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(order.total_amount)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Today's Classes */}
        <div className="admin-table-container" style={{ padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Ca Học Hôm Nay</h2>
            <Link to="/admin/lich-hoc" style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Xem lịch tuần <ArrowRight size={14} />
            </Link>
          </div>

          {todaySchedules.length === 0 ? (
            <div className="empty-state">
              <Calendar size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p>Hôm nay không có ca học nào được lên lịch.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Giờ học</th>
                  <th>Lớp</th>
                  <th>HLV</th>
                  <th>Phòng</th>
                </tr>
              </thead>
              <tbody>
                {todaySchedules.map(sch => (
                  <tr key={sch.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {sch.start_time?.slice(0, 5)} - {sch.end_time?.slice(0, 5)}
                    </td>
                    <td>{sch.yoga_classes?.name}</td>
                    <td>{sch.yoga_classes?.instructor}</td>
                    <td><span className="badge badge-secondary">{sch.room}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
