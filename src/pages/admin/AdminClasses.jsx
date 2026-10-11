import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Check, Eye } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './AdminShared.css'

export default function AdminClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructor: 'Huyền Trang',
    level: 'all',
    duration_minutes: 60,
    capacity: 15,
    price: 150000,
    image_url: '',
    is_active: true
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('yoga_classes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Lỗi khi tải danh sách lớp học')
    } else {
      setClasses(data || [])
    }
    setLoading(false)
  }

  const handleOpenModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls)
      setFormData({
        name: cls.name,
        description: cls.description || '',
        instructor: cls.instructor,
        level: cls.level || 'all',
        duration_minutes: cls.duration_minutes || 60,
        capacity: cls.capacity || 15,
        price: cls.price || 0,
        image_url: cls.image_url || '',
        is_active: cls.is_active ?? true
      })
    } else {
      setEditingClass(null)
      setFormData({
        name: '',
        description: '',
        instructor: 'Huyền Trang',
        level: 'all',
        duration_minutes: 60,
        capacity: 15,
        price: 150000,
        image_url: '',
        is_active: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingClass(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      return toast.error('Vui lòng nhập tên lớp học')
    }

    try {
      if (editingClass) {
        const { error } = await supabase
          .from('yoga_classes')
          .update(formData)
          .eq('id', editingClass.id)

        if (error) throw error
        toast.success('Cập nhật lớp học thành công!')
      } else {
        const { error } = await supabase
          .from('yoga_classes')
          .insert([formData])

        if (error) throw error
        toast.success('Thêm lớp học mới thành công!')
      }
      handleCloseModal()
      fetchClasses()
    } catch (err) {
      toast.error('Có lỗi xảy ra: ' + err.message)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lớp "${name}"?`)) return

    const { error } = await supabase
      .from('yoga_classes')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Không thể xóa lớp học: ' + error.message)
    } else {
      toast.success('Đã xóa lớp học')
      fetchClasses()
    }
  }

  const filtered = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  )

  const getLevelLabel = (lvl) => {
    switch (lvl) {
      case 'beginner': return 'Cơ bản'
      case 'intermediate': return 'Trung cấp'
      case 'advanced': return 'Nâng cao'
      default: return 'Mọi cấp độ'
    }
  }

  return (
    <div className="admin-classes-page">
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Quản Lý Lớp Học</h1>
          <p>Danh sách các lớp học yoga tại trung tâm Yoga Huyền Trang</p>
        </div>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => handleOpenModal()} id="btn-add-class">
            <Plus size={18} /> Thêm Lớp Mới
          </button>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-box">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Tìm theo tên lớp hoặc giáo viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-controls">
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Tổng số: <strong>{filtered.length}</strong> lớp
          </span>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <p className="empty-state">Đang tải danh sách lớp học...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>Không tìm thấy lớp học nào.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lớp Học</th>
                <th>HLV</th>
                <th>Cấp Độ</th>
                <th>Thời Lượng</th>
                <th>Sức Chứa</th>
                <th>Học Phí</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(cls => (
                <tr key={cls.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {cls.image_url ? (
                        <img
                          src={cls.image_url}
                          alt={cls.name}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--sage-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 600 }}>
                          {cls.name?.[0]}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cls.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cls.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{cls.instructor}</td>
                  <td><span className="badge badge-secondary">{getLevelLabel(cls.level)}</span></td>
                  <td>{cls.duration_minutes} phút</td>
                  <td>{cls.capacity} học viên</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(cls.price)}</td>
                  <td>
                    {cls.is_active ? (
                      <span className="badge badge-success">Đang mở</span>
                    ) : (
                      <span className="badge badge-secondary">Tạm dừng</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-icon"
                        title="Chỉnh sửa"
                        onClick={() => handleOpenModal(cls)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Xóa"
                        onClick={() => handleDelete(cls.id, cls.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Add / Edit Class */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClass ? 'Chỉnh Sửa Lớp Học' : 'Thêm Lớp Học Mới'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Tên lớp học *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Hatha Yoga Căn Bản"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Giảng viên / HLV *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.instructor}
                    onChange={e => setFormData({ ...formData, instructor: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Cấp độ</label>
                    <select
                      className="form-input"
                      value={formData.level}
                      onChange={e => setFormData({ ...formData, level: e.target.value })}
                    >
                      <option value="all">Mọi cấp độ</option>
                      <option value="beginner">Cơ bản</option>
                      <option value="intermediate">Trung cấp</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Thời lượng (phút)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.duration_minutes}
                      onChange={e => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Sức chứa (học viên)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.capacity}
                      onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Học phí (VNĐ)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Link ảnh đại diện</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Mô tả lớp học</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Giới thiệu về lớp, lợi ích cho học viên..."
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <label htmlFor="is_active" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                    Kích hoạt hiển thị lớp học này cho học viên
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClass ? 'Lưu thay đổi' : 'Tạo lớp học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
