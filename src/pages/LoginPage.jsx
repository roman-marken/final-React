import { useState } from 'react'
import { ArrowRight, Cloud, FolderOpen, LockKeyhole } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  if (localStorage.getItem('mini-cloud-token')) return <Navigate to="/dashboard" replace />

  function signIn(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') || '').trim()
    const password = String(formData.get('password') || '')
    if (!username || !password) return setError('Введите имя пользователя и пароль.')
    localStorage.setItem('mini-cloud-token', `demo-${crypto.randomUUID()}`)
    localStorage.setItem('mini-cloud-user', username)
    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="login-page">
      <div className="login-brand brand"><span className="brand-mark"><Cloud size={21} fill="currentColor" /></span>mini<span>cloud</span></div>
      <div className="login-card">
        <div className="login-icon"><FolderOpen size={27} /></div>
        <p className="eyebrow">ЛИЧНОЕ ОБЛАЧНОЕ ХРАНИЛИЩЕ</p>
        <h1>Ваши файлы.<br />Всегда под рукой.</h1>
        <p className="login-description">Войдите, чтобы открыть свою библиотеку изображений.</p>
        <form onSubmit={signIn}>
          <label htmlFor="username">Имя пользователя</label>
          <input id="username" name="username" autoComplete="username" placeholder="Например, Алексей" />
          <label htmlFor="password">Пароль</label>
          <div className="password-field"><LockKeyhole size={17} /><input id="password" name="password" type="password" autoComplete="current-password" placeholder="Введите пароль" /></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button-primary login-submit" type="submit">Войти в облако <ArrowRight size={17} /></button>
        </form>
        <p className="demo-note">Демо-вход: подойдут любые имя и пароль</p>
      </div>
      <p className="login-footer">Ваши изображения хранятся локально в этом браузере</p>
    </main>
  )
}
