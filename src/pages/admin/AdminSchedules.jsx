import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, Clock, X, AlertTriangle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import './AdminShared.css'

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showModal, setShowModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [formData, setFormData] = useState({
    class_id: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    start_time: '06:00',
    end_time: '07:00',
    room: 'Phòng 1 (Tầng 2)',
    is_cancelled: false
  })

  useEffect(() => {
    fetchClasses()
    fetchSchedules()
  }, [selectedDate])

  const fetchClasses = async () => {
    const { data } = await supabase.from('yoga_classes').select('id, name').eq('is_active', true)
    if (data) setClasses(data)
  }

  const fetchSchedules = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('class_schedules')
      .select(`
        id, scheduled_date, start_time, end_time, room, is_cancelled, class_id,
        yoga_classes (name, instructor, capacity)
      `)
      .eq('scheduled_date', selectedDate)
      .order('start_time', { ascending: true })

    if (error) {
      toast.error('Lỗi khi tải lịch học')
    } else {
      setSchedules(data || [])
    }
    setLoading(false)
  }

  const handleOpenModal = (sch = null) => {
    if (sch) {
      setEditingSchedule(sch)
      setFormData({
        class_id: sch.class_id,
        scheduled_date: sch.scheduled_date,
        start_time: sch.start_time?.slice(0, 5) || '06:00',
        end_time: sch.end_time?.slice(0, 5) || '07:00',
        room: sch.room || 'Phòng 1 (Tầng 2)',
        is_cancelled: sch.is_cancelled || false
      })
    } else {
      setEditingSchedule(null)
      setFormData({
        class_id: classes[0]?.id || '',
        scheduled_date: selectedDate,
        start_time: '06:00',
        end_time: '07:00',
        room: 'Phòng 1 (Tầng 2)',
        is_cancelled: false
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSchedule(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.class_id) {
      return toast.error('Vui lòng chọn lớp học')
    }

    try {
      if (editingSchedule) {
        const { error } = await supabase
          .from('class_schedules')
          .update(formData)
          .eq('id', editingSchedule.id)

        if (error) throw error
        toast.success('Cập nhật ca học thành công!')
      } else {
        const { error } = await supabase
          .from('class_schedules')
          .insert([formData])

        if (error) throw error
        toast.success('Thêm ca học thành công!')
      }
      handleCloseModal()
      fetchSchedules()
    } catch (err) {
      toast.error('Có lỗi: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa ca học này?')) return

    const { error } = await supabase.from('class_schedules').delete().eq('id', id)
    if (error) {
      toast.error('Không thể xóa ca học: ' + error.message)
    } else {
      toast.success('Đã xóa ca học')
      fetchSchedules()
    }
  }

  return (
    <div className="admin-schedules-page">
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Lịch Giảng Dạy & Ca Học</h1>
          <p>Lên lịch các ca tập trong ngày và quản lý phòng tập</p>
        </div>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Thêm Ca Học Mới
          </button>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={18} color="var(--primary)" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Chọn ngày xem:</span>
          <input
            type="date"
            className="admin-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          >
            Hôm nay
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <p className="empty-state">Đang tải lịch học ngày {selectedDate}...</p>
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <Calendar size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>Ngày {selectedDate} chưa có ca học nào được xếp.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => handleOpenModal()}>
              <Plus size={16} /> Thêm ca học cho ngày này
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thời Gian</th>
                <th>Lớp Học</th>
                <th>Huấn Luyện Viên</th>
                <th>Phòng Học</th>
                <th>Sức Chứa</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(sch => (
                <tr key={sch.id}>
                  <td style={{ fontWeight: 600 }}>
                    <Clock size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: 'var(--primary)' }} />
                    {sch.start_time?.slice(0, 5)} - {sch.end_time?.slice(0, 5)}
                  </td>
                  <td style={{ fontWeight: 600 }}>{sch.yoga_classes?.name}</td>
                  <td>{sch.yoga_classes?.instructor}</td>
                  <td><span className="badge badge-secondary">{sch.room}</span></td>
                  <td>{sch.yoga_classes?.capacity} người</td>
                  <td>
                    {sch.is_cancelled ? (
                      <span className="badge badge-danger">Đã hủy ca</span>
                    ) : (
                      <span className="badge badge-success">Bình thường</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" title="Sửa" onClick={() => handleOpenModal(sch)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon delete" title="Xóa" onClick={() => handleDelete(sch.id)}>
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

      {/* Modal Add/Edit Schedule */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSchedule ? 'Cập Nhật Ca Học' : 'Thêm Ca Học Mới'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Chọn lớp học *</label>
                  <select
                    className="form-input"
                    value={formData.class_id}
                    onChange={e => setFormData({ ...formData, class_id: e.target.value })}
                    required
                  >
                    <option value="">-- Chọn lớp yoga --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Ngày học *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.scheduled_date}
                    onChange={e => setFormData({ ...formData, scheduled_date: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Giờ bắt đầu *</label>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.start_time}
                      onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Giờ kết thúc *</label>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.end_time}
                      onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Phòng học</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                    placeholder="VD: Phòng 1 (Tầng 2)"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    id="is_cancelled"
                    checked={formData.is_cancelled}
                    onChange={e => setFormData({ ...formData, is_cancelled: e.target.checked })}
                  />
                  <label htmlFor="is_cancelled" style={{ fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-danger)' }}>
                    Đánh dấu Hủy ca học này (thông báo cho học viên)
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSchedule ? 'Lưu thay đổi' : 'Tạo ca học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
