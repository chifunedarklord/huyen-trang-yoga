import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Leaf } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import './AuthPages.css'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    const { error } = await signIn(data)
    setLoading(false)
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Email hoặc mật khẩu không đúng'
        : error.message)
    } else {
      toast.success('Đăng nhập thành công!')
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-circle auth-circle-1" />
        <div className="auth-circle auth-circle-2" />
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <img src="/logo.jpg" alt="Logo" />
            </Link>
            <h1>Đăng Nhập</h1>
            <p>Chào mừng bạn quay trở lại!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="email@example.com"
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' }
                })}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <div className="flex-between">
                <label className="form-label" htmlFor="login-password">Mật khẩu</label>
                <Link to="/quen-mat-khau" className="forgot-link">Quên mật khẩu?</Link>
              </div>
              <div className="input-wrap">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Nhập mật khẩu"
                  {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)} id="toggle-password">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="submit-login">
              {loading ? <span className="spinner" style={{width:20,height:20}} /> : 'Đăng Nhập'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Chưa có tài khoản? <Link to="/dang-ky" className="text-sage">Đăng ký ngay</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    const { error } = await signUp({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
    })
    setLoading(false)
    if (error) {
      toast.error(error.message === 'User already registered'
        ? 'Email này đã được đăng ký'
        : error.message)
    } else {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.')
      navigate('/dang-nhap')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-circle auth-circle-1" />
        <div className="auth-circle auth-circle-2" />
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <img src="/logo.jpg" alt="Logo" />
            </Link>
            <h1>Đăng Ký</h1>
            <p>Tạo tài khoản để bắt đầu hành trình yoga</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" id="register-form">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-fullname">Họ và tên</label>
              <input
                id="reg-fullname"
                type="text"
                className="form-input"
                placeholder="Nguyễn Văn A"
                {...register('fullName', { required: 'Vui lòng nhập họ và tên' })}
              />
              {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="email@example.com"
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' }
                })}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Số điện thoại</label>
              <input
                id="reg-phone"
                type="tel"
                className="form-input"
                placeholder="09xxxxxxxx"
                {...register('phone')}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Mật khẩu</label>
              <div className="input-wrap">
                <input
                  id="reg-password"
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Tối thiểu 6 ký tự"
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu',
                    minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
                  })}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)} id="toggle-reg-password">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Xác nhận mật khẩu</label>
              <input
                id="reg-confirm"
                type="password"
                className="form-input"
                placeholder="Nhập lại mật khẩu"
                {...register('confirmPassword', {
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: v => v === password || 'Mật khẩu xác nhận không khớp'
                })}
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="submit-register">
              {loading ? <span className="spinner" style={{width:20,height:20}} /> : 'Đăng Ký'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Đã có tài khoản? <Link to="/dang-nhap" className="text-sage">Đăng nhập</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
