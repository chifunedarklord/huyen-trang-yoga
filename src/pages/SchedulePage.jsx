import { useEffect, useState } from 'react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar, Clock, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice, levelLabel } from '../utils/helpers'
import toast from 'react-hot-toast'
import './SchedulePage.css'

export default function SchedulePage() {
  const { user, profile } = useAuth()
  const [classes, setClasses] = useState([])
  const [schedules, setSchedules] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [bookingLoading, setBookingLoading] = useState({})

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  useEffect(() => { fetchData() }, [weekStart, user])

  const fetchData = async () => {
    setLoading(true)
    const from = format(weekDays[0], 'yyyy-MM-dd')
    const to   = format(weekDays[6], 'yyyy-MM-dd')

    const [classRes, schedRes] = await Promise.all([
      supabase.from('yoga_classes').select('*').eq('is_active', true),
      supabase.from('class_schedules')
        .select('*, yoga_classes(*)')
        .gte('scheduled_date', from)
        .lte('scheduled_date', to)
        .eq('is_cancelled', false)
        .order('start_time'),
    ])

    setClasses(classRes.data || [])
    setSchedules(schedRes.data || [])

    if (user) {
      const { data: bk } = await supabase
        .from('class_bookings')
        .select('schedule_id, status')
        .eq('user_id', user.id)
        .in('schedule_id', (schedRes.data || []).map(s => s.id))
      setBookings(bk || [])
    }
    setLoading(false)
  }

  const isBooked = (scheduleId) =>
    bookings.some(b => b.schedule_id === scheduleId && b.status !== 'cancelled')

  const handleBook = async (schedule) => {
    if (!user) { toast.error('Vui lòng đăng nhập để đặt lịch'); return }
    if (isBooked(schedule.id)) { toast('Bạn đã đặt lịch buổi học này rồi'); return }

    setBookingLoading(p => ({ ...p, [schedule.id]: true }))
    const { error } = await supabase.from('class_bookings').insert({
      schedule_id: schedule.id,
      user_id: user.id,
      status: 'confirmed',
      payment_status: 'pending',
    })
    setBookingLoading(p => ({ ...p, [schedule.id]: false }))

    if (error) {
      toast.error('Không thể đặt lịch. Vui lòng thử lại.')
    } else {
      toast.success('Đặt lịch thành công!')
      fetchData()
    }
  }

  const schedulesForDay = (day) =>
    schedules.filter(s => isSameDay(new Date(s.scheduled_date), day))

  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']

  return (
    <div className="schedule-page">
      {/* Hero */}
      <div className="schedule-hero">
        <div className="container">
          <span className="section-tag" style={{color:'var(--sage-300)'}}>Lịch Học</span>
          <h1>Đặt Lịch Lớp Yoga</h1>
          <p>Chọn buổi học phù hợp với lịch trình của bạn</p>
        </div>
      </div>

      <div className="container">
        {/* Classes overview */}
        <div className="classes-overview">
          <h2>Các Lớp Học</h2>
          <div className="classes-mini-grid">
            {classes.map(c => (
              <div key={c.id} className="class-mini-card">
                <div className="class-mini-header">
                  <span className="badge badge-sage">{levelLabel[c.level]}</span>
                  <span className="class-mini-price">{formatPrice(c.price)}/buổi</span>
                </div>
                <h4>{c.name}</h4>
                <p className="text-muted" style={{fontSize:'0.82rem'}}>{c.description}</p>
                <div className="class-mini-meta">
                  <Clock size={12} /> {c.duration_minutes} phút &nbsp;|&nbsp;
                  <Users size={12} /> Tối đa {c.capacity} người
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Week navigator */}
        <div className="week-nav">
          <button
            className="btn btn-ghost btn-sm week-nav-btn"
            onClick={() => setWeekStart(d => addDays(d, -7))}
            id="prev-week"
          >
            <ChevronLeft size={18} /> Tuần trước
          </button>
          <span className="week-label">
            {format(weekDays[0], 'd/M', { locale: vi })} – {format(weekDays[6], 'd/M/yyyy', { locale: vi })}
          </span>
          <button
            className="btn btn-ghost btn-sm week-nav-btn"
            onClick={() => setWeekStart(d => addDays(d, 7))}
            id="next-week"
          >
            Tuần sau <ChevronRight size={18} />
          </button>
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div className="flex-center" style={{height:300}}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="calendar-grid">
            {weekDays.map((day, i) => {
              const daySchedules = schedulesForDay(day)
              const isToday = isSameDay(day, new Date())
              return (
                <div key={i} className={`calendar-day ${isToday ? 'today' : ''}`} id={`day-${format(day, 'yyyy-MM-dd')}`}>
                  <div className="day-header">
                    <span className="day-name">{dayNames[i]}</span>
                    <span className={`day-date ${isToday ? 'today-badge' : ''}`}>
                      {format(day, 'd')}
                    </span>
                  </div>

                  <div className="day-schedules">
                    {daySchedules.length === 0 ? (
                      <div className="no-schedule">Không có lớp</div>
                    ) : (
                      daySchedules.map(s => {
                        const booked = isBooked(s.id)
                        return (
                          <div key={s.id} className={`schedule-slot ${booked ? 'booked' : ''}`} id={`schedule-${s.id}`}>
                            <div className="slot-time">
                              <Clock size={11} />
                              {s.start_time?.slice(0,5)} – {s.end_time?.slice(0,5)}
                            </div>
                            <div className="slot-name">{s.yoga_classes?.name}</div>
                            <div className="slot-room">{s.room}</div>
                            <div className="slot-price">{formatPrice(s.yoga_classes?.price)}</div>
                            {booked ? (
                              <span className="badge badge-success" style={{fontSize:'0.72rem'}}>Đã đặt</span>
                            ) : (
                              <button
                                className="btn btn-primary btn-sm slot-book-btn"
                                onClick={() => handleBook(s)}
                                disabled={bookingLoading[s.id]}
                                id={`book-${s.id}`}
                              >
                                {bookingLoading[s.id] ? '...' : 'Đặt'}
                              </button>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!user && (
          <div className="login-prompt">
            <Calendar size={32} />
            <h3>Đăng nhập để đặt lịch</h3>
            <p>Bạn cần có tài khoản để đặt lịch lớp học</p>
            <a href="/dang-nhap" className="btn btn-primary" id="schedule-login-btn">Đăng nhập ngay</a>
          </div>
        )}
      </div>
    </div>
  )
}
