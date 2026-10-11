import { useEffect, useState } from 'react'
import { Search, Calendar, Check, X, UserCheck, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import './AdminShared.css'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('class_bookings')
      .select(`
        id, status, payment_status, payment_method, notes, created_at,
        profiles (full_name, phone),
        class_schedules (
          scheduled_date, start_time, end_time, room,
          yoga_classes (name, instructor, price)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Lỗi khi tải danh sách đặt lịch')
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  const handleUpdateStatus = async (bookingId, newStatus, newPaymentStatus) => {
    try {
      const updateData = {}
      if (newStatus) updateData.status = newStatus
      if (newPaymentStatus) updateData.payment_status = newPaymentStatus

      const { error } = await supabase
        .from('class_bookings')
        .update(updateData)
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Cập nhật trạng thái thành công!')
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, ...updateData } : b))
    } catch (err) {
      toast.error('Có lỗi xảy ra: ' + err.message)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'attended': return <span className="badge badge-success">Đã tham gia</span>
      case 'confirmed': return <span className="badge badge-info">Đã xác nhận</span>
      case 'cancelled': return <span className="badge badge-danger">Đã hủy</span>
      default: return <span className="badge badge-warning">Chờ duyệt</span>
    }
  }

  const filtered = bookings.filter(b => {
    const userName = b.profiles?.full_name || ''
    const userPhone = b.profiles?.phone || ''
    const className = b.class_schedules?.yoga_classes?.name || ''
    const matchSearch =
      userName.toLowerCase().includes(search.toLowerCase()) ||
      userPhone.includes(search) ||
      className.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="admin-bookings-page">
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Quản Lý Đặt Lịch Tập</h1>
          <p>Danh sách học viên đăng ký các ca học yoga</p>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-box">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Tìm theo tên học viên, số ĐT hoặc tên lớp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-controls">
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="attended">Đã tham gia</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <strong>{filtered.length}</strong> lượt đăng ký
          </span>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <p className="empty-state">Đang tải danh sách đặt lịch...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>Không tìm thấy lượt đặt lịch nào.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Học Viên</th>
                <th>Lớp Học</th>
                <th>Ngày & Ca Học</th>
                <th>Phòng</th>
                <th>Ghi Chú</th>
                <th>Học Phí</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.profiles?.full_name || 'Học viên'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.profiles?.phone || 'Chưa có SĐT'}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.class_schedules?.yoga_classes?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>HLV: {b.class_schedules?.yoga_classes?.instructor}</div>
                  </td>
                  <td>
                    <div><strong>{b.class_schedules?.scheduled_date}</strong></div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {b.class_schedules?.start_time?.slice(0, 5)} - {b.class_schedules?.end_time?.slice(0, 5)}
                    </div>
                  </td>
                  <td><span className="badge badge-secondary">{b.class_schedules?.room}</span></td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 150 }}>
                    {b.notes || '-'}
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      value={b.payment_status}
                      onChange={(e) => handleUpdateStatus(b.id, null, e.target.value)}
                    >
                      <option value="pending">Chưa thu</option>
                      <option value="paid">Đã thu</option>
                      <option value="refunded">Hoàn tiền</option>
                    </select>
                  </td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    <div className="table-actions">
                      {b.status !== 'attended' && (
                        <button
                          className="btn-icon"
                          title="Điểm danh đã tham gia"
                          onClick={() => handleUpdateStatus(b.id, 'attended', null)}
                          style={{ color: '#2e7d32' }}
                        >
                          <UserCheck size={16} />
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          className="btn-icon delete"
                          title="Hủy đặt lịch"
                          onClick={() => handleUpdateStatus(b.id, 'cancelled', null)}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
