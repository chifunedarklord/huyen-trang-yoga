import { Link } from 'react-router-dom'
import { Heart, Sparkles, Award, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="about-page" style={{ paddingTop: 100, minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, var(--sage-700), var(--sage-900))',
        color: 'white',
        padding: '80px 0 60px',
        textAlign: 'center',
        marginBottom: 60
      }}>
        <div className="container">
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '6px 16px',
            borderRadius: 999,
            fontSize: '0.85rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: 16
          }}>
            Về Chúng Tôi
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Câu Chuyện Yoga Huyền Trang</h1>
          <p style={{ maxWidth: 640, margin: '0 auto', opacity: 0.9, lineHeight: 1.6 }}>
            Nơi kết nối thân - tâm - trí, mang lại sự bình an, sức sống dồi dào và vóc dáng dẻo dai cho từng học viên.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center', marginBottom: 80 }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>
              Sứ mệnh của chúng tôi
            </span>
            <h2 style={{ fontSize: '2rem', margin: '12px 0 20px', lineHeight: 1.3 }}>
              Hành Trình Tìm Lại Sự Cân Bằng Giữa Cuộc Sống Hiện Đại
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              Yoga Huyền Trang được thành lập từ tình yêu thuần khiết với bộ môn Yoga cổ điển và mong muốn đồng hành cùng cộng đồng trên con đường chăm sóc sức khỏe toàn diện.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
              Chúng tôi tin rằng Yoga không chỉ là những động tác uốn lượn trên thảm, mà là phong cách sống chánh niệm, biết lắng nghe cơ thể và trân trọng từng hơi thở.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 color="var(--primary)" size={20} />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>HLV chứng chỉ Quốc tế</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 color="var(--primary)" size={20} />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Phòng tập chuẩn Zen</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 color="var(--primary)" size={20} />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Lớp học nhóm giới hạn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 color="var(--primary)" size={20} />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Dụng cụ chính hãng 100%</span>
              </div>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80"
              alt="HLV Yoga Huyền Trang"
              style={{ width: '100%', borderRadius: 24, boxShadow: 'var(--shadow-xl)', objectFit: 'cover', height: 420 }}
            />
          </div>
        </div>

        {/* 3 Core Values */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.8rem' }}>Giá Trị Cốt Lõi</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 80 }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 16, border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)' }}>
              <Heart size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>Tận Tâm & Chu Đáo</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Chăm chút sửa từng động tác, lắng nghe tình trạng thể chất của từng học viên để có lộ trình phù hợp nhất.
            </p>
          </div>

          <div style={{ background: 'white', padding: 32, borderRadius: 16, border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#1565c0' }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>Chuyên Môn Sâu</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Đào tạo bài bản theo trường phái Yoga Trị Liệu, Hatha và Vinyasa chuẩn định tuyến an toàn.
            </p>
          </div>

          <div style={{ background: 'white', padding: 32, borderRadius: 16, border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#e65100' }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>Không Gian Bình Yên</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Mùi hương tinh dầu tự nhiên, tiếng chuông xoay Tây Tạng và âm nhạc chữa lành xua tan mọi mệt mỏi.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, var(--sage-800), var(--sage-900))',
          borderRadius: 24,
          padding: '60px 40px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>Bắt Đầu Hành Trình Của Bạn Ngay Hôm Nay</h2>
          <p style={{ opacity: 0.9, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Đăng ký buổi tập thử nghiệm hoặc trang bị cho mình chiếc thảm tập ưng ý nhất.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/lich-hoc" className="btn btn-secondary">
              Xem Lịch Lớp Học
            </Link>
            <Link to="/san-pham" className="btn btn-primary">
              Cửa Hàng Yoga <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
