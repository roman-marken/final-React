import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

export function ProtectedRoute({ children }) {
  return localStorage.getItem('mini-cloud-token') ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={localStorage.getItem('mini-cloud-token') ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
