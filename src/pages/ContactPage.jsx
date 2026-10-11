import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Cảm ơn bạn đã liên hệ! Yoga Huyền Trang sẽ phản hồi sớm nhất.')
    setSubmitted(true)
  }

  return (
    <div className="contact-page" style={{ paddingTop: 100, minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, var(--sage-700), var(--sage-900))',
        color: 'white',
        padding: '70px 0 50px',
        textAlign: 'center',
        marginBottom: 60
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: 12 }}>Liên Hệ Với Chúng Tôi</h1>
          <p style={{ maxWidth: 500, margin: '0 auto', opacity: 0.9 }}>
            Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên con đường luyện tập.
          </p>
        </div>
      </section>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>
          {/* Info Side */}
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: 20 }}>Thông Tin Phòng Tập</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
              Nếu bạn có bất kỳ thắc mắc nào về khóa học, lịch tập, dịch vụ tập thử hoặc đặt mua sản phẩm yoga, xin vui lòng liên hệ với chúng tôi:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--sage-100)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: 4 }}>Địa chỉ phòng tập</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    123 Đường Nguyễn Trãi, Phường Thượng Đình, Quận Thanh Xuân, Hà Nội
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--sage-100)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: 4 }}>Hotline & Zalo</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    0988 123 456 (Cô Huyền Trang)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--sage-100)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: 4 }}>Email</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    yogahuyentrang@gmail.com
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--sage-100)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: 4 }}>Giờ mở cửa</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Ca sáng: 05:30 - 11:30 | Ca chiều tối: 16:30 - 20:30 (Thứ 2 - Chủ Nhật)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: 36,
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Gửi Tin Nhắn Cho Cô Trang</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
              Để lại thông tin, chúng tôi sẽ gọi điện hoặc nhắn tin tư vấn miễn phí cho bạn trong vòng 15 phút.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                <h3>Đã Gửi Thành Công!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
                  Cảm ơn bạn! Huấn luyện viên Huyền Trang sẽ liên hệ với bạn ngay nhé.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Thị Mai"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Số điện thoại (có Zalo) *</label>
                  <input
                    type="tel"
                    className="form-input"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0988 xxx xxx"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Email (nếu có)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mai@example.com"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label className="form-label">Nội dung cần tư vấn / Lớp học quan tâm</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="VD: Em muốn tìm hiểu lớp Yoga trị liệu đau lưng vai gáy cho người mới bắt đầu..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" style={{ padding: 12 }}>
                  <Send size={18} /> Gửi Yêu Cầu Tư Vấn
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
