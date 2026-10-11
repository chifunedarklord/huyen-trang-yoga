import { useEffect, useState } from 'react'
import { Search, Shield, User, Phone, MapPin, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import './AdminShared.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Lỗi khi tải danh sách người dùng: ' + error.message)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin'
    if (!window.confirm(`Bạn có chắc muốn đổi vai trò của người dùng này sang ${newRole.toUpperCase()}?`)) return

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      toast.error('Không thể cập nhật quyền: ' + error.message)
    } else {
      toast.success(`Đã đổi vai trò sang ${newRole}`)
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    }
  }

  const filtered = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || '').includes(search)
  )

  return (
    <div className="admin-users-page">
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Quản Lý Học Viên & Khách Hàng</h1>
          <p>Danh sách tài khoản đăng ký trên hệ thống Yoga Huyền Trang</p>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-box">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Tìm theo tên học viên hoặc số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-controls">
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Tổng số: <strong>{filtered.length}</strong> thành viên
          </span>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <p className="empty-state">Đang tải danh sách tài khoản...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <User size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>Không tìm thấy thành viên nào.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thành Viên</th>
                <th>Số Điện Thoại</th>
                <th>Địa Chỉ</th>
                <th>Ngày Gia Nhập</th>
                <th>Vai Trò</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: user.role === 'admin' ? 'var(--primary)' : 'var(--sage-200)',
                        color: user.role === 'admin' ? 'white' : 'var(--sage-800)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}>
                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{user.full_name || 'Chưa đặt tên'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {user.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.phone || '-'}</td>
                  <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.address || '-'}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    {user.role === 'admin' ? (
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Shield size={12} /> Quản trị viên
                      </span>
                    ) : (
                      <span className="badge badge-secondary">Học viên / Khách</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleToggleRole(user.id, user.role)}
                      style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                    >
                      {user.role === 'admin' ? 'Hạ xuống Khách' : 'Gán quyền Admin'}
                    </button>
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
