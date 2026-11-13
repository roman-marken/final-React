import { Cloud, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  function logout() {
    localStorage.removeItem('mini-cloud-token')
    navigate('/login', { replace: true })
  }
  return (
    <header className="app-header">
      <Link className="brand" to="/dashboard"><span className="brand-mark"><Cloud size={21} fill="currentColor" /></span>mini<span>cloud</span></Link>
      <div className="header-right"><span className="avatar">M</span><button className="logout-button" type="button" onClick={logout}><LogOut size={16} /><span>Выйти</span></button></div>
    </header>
  )
}
