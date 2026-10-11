import { useState } from 'react'
import { Save, Building, CreditCard, Shield, Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import './AdminShared.css'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    studioName: 'Yoga Huyền Trang',
    hotline: '0988 123 456',
    email: 'yogahuyentrang@gmail.com',
    address: '123 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội',
    openingHours: '05:30 - 21:00 hàng ngày',
    bankName: 'Vietcombank - Chi nhánh Thăng Long',
    accountNumber: '0011004321987',
    accountHolder: 'HOANG THI HUYEN TRANG',
    cancelPolicyHours: '4',
    enableSmsReminder: true
  })

  const handleSave = (e) => {
    e.preventDefault()
    // Lưu cài đặt vào localStorage để duy trì cấu hình
    localStorage.setItem('yoga_studio_settings', JSON.stringify(settings))
    toast.success('Lưu cài đặt hệ thống thành công!')
  }

  return (
    <div className="admin-settings-page">
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Cài Đặt Hệ Thống</h1>
          <p>Cấu hình thông tin phòng tập, tài khoản nhận thanh toán và chính sách</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 24 }}>
          {/* Thông tin phòng tập */}
          <div className="admin-table-container" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Building size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Thông Tin Phòng Tập</h3>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Tên thương hiệu / Trung tâm</label>
              <input
                type="text"
                className="form-input"
                value={settings.studioName}
                onChange={e => setSettings({ ...settings, studioName: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Hotline tư vấn</label>
              <input
                type="text"
                className="form-input"
                value={settings.hotline}
                onChange={e => setSettings({ ...settings, hotline: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Email liên hệ</label>
              <input
                type="email"
                className="form-input"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Địa chỉ cơ sở</label>
              <input
                type="text"
                className="form-input"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Giờ hoạt động</label>
              <input
                type="text"
                className="form-input"
                value={settings.openingHours}
                onChange={e => setSettings({ ...settings, openingHours: e.target.value })}
              />
            </div>
          </div>

          {/* Tài khoản thanh toán */}
          <div className="admin-table-container" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <CreditCard size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Tài Khoản Nhận Chuyển Khoản</h3>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Tên ngân hàng</label>
              <input
                type="text"
                className="form-input"
                value={settings.bankName}
                onChange={e => setSettings({ ...settings, bankName: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Số tài khoản nhận tiền</label>
              <input
                type="text"
                className="form-input"
                value={settings.accountNumber}
                onChange={e => setSettings({ ...settings, accountNumber: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Chủ tài khoản (Không dấu)</label>
              <input
                type="text"
                className="form-input"
                value={settings.accountHolder}
                onChange={e => setSettings({ ...settings, accountHolder: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Quy định hủy lịch trước (tiếng)</label>
              <input
                type="number"
                className="form-input"
                value={settings.cancelPolicyHours}
                onChange={e => setSettings({ ...settings, cancelPolicyHours: e.target.value })}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Học viên hủy lịch trước số giờ này sẽ được hoàn/bảo lưu buổi học
              </span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            <Save size={18} /> Lưu Cài Đặt Hệ Thống
          </button>
        </div>
      </form>
    </div>
  )
}
