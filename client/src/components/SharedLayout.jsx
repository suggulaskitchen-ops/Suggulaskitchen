import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

function SharedLayout({ title, description, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdminPage = location.pathname.startsWith('/admin')
  const { isAdminAuthenticated, logout } = useAuth()
  const showAuthAction = isAdminPage && location.pathname !== '/admin/login'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10 flex flex-col gap-6 rounded-[2rem] bg-white/90 p-6 shadow-xl shadow-slate-200/80 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-600/10">
              <Logo className="h-10 w-10" alt="Suggula's Kitchen logo" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-500">Suggula's Kitchen</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
            </div>
          </div>
          {showAuthAction && (
            <div className="flex items-center gap-3">
              {isAdminPage && isAdminAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Admin login
                </Link>
              )}
            </div>
          )}
        </header>

        {children ?? <Outlet />}
      </main>
    </div>
  )
}

export default SharedLayout
