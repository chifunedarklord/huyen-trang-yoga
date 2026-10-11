import { Link } from 'react-router-dom'
import { Calendar, Clock, Users, BookOpen } from 'lucide-react'
import { formatPrice, levelLabel } from '../../utils/helpers'
import './ClassCard.css'

export default function ClassCard({ yogaClass, schedule }) {
  const level = levelLabel[yogaClass.level] || yogaClass.level

  return (
    <article className="class-card card" id={`class-${yogaClass.id}`}>
      <div className="class-image-wrap">
        {yogaClass.image_url ? (
          <img src={yogaClass.image_url} alt={yogaClass.name} className="class-img" loading="lazy" />
        ) : (
          <div className="class-img-placeholder">🧘‍♀️</div>
        )}
        <span className={`class-level badge badge-sage`}>{level}</span>
      </div>

      <div className="card-body class-info">
        <h3 className="class-name">{yogaClass.name}</h3>
        <p className="class-desc">{yogaClass.description}</p>

        <div className="class-meta">
          <div className="meta-item">
            <Clock size={14} />
            <span>{yogaClass.duration_minutes} phút</span>
          </div>
          <div className="meta-item">
            <Users size={14} />
            <span>Tối đa {yogaClass.capacity} người</span>
          </div>
          {schedule && (
            <div className="meta-item">
              <Calendar size={14} />
              <span>{schedule.start_time?.slice(0,5)} – {schedule.end_time?.slice(0,5)}</span>
            </div>
          )}
        </div>

        <div className="class-footer">
          <div>
            <div className="instructor">
              <BookOpen size={13} />
              <span>HLV: <strong>{yogaClass.instructor}</strong></span>
            </div>
            <div className="class-price">
              {yogaClass.price > 0 ? formatPrice(yogaClass.price) + '/buổi' : 'Miễn phí'}
            </div>
          </div>
          <Link
            to="/dang-nhap"
            className="btn btn-primary btn-sm"
            id={`book-class-${yogaClass.id}`}
          >
            Đặt Lịch
          </Link>
        </div>
      </div>
    </article>
  )
}
