import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminRoute() {
  const { isAdminAuthenticated, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return null
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export default AdminRoute
