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
    <div className={`min-h-screen text-slate-900 ${isAdminPage ? 'bg-[#24301b]' : 'bg-[#fffaf3]'}`}>
      <main className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
        <header className={`mb-5 flex flex-col gap-4 border-b px-1 pb-4 sm:flex-row sm:items-center sm:justify-between ${isAdminPage ? 'border-white/10 text-white' : 'border-[#d8cebd]'}`}>
          <Link to={isAdminPage ? '/admin' : '/customer'} className="flex items-center gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${isAdminPage ? 'bg-[#fffaf3]' : 'bg-white shadow-sm'}`}>
              <Logo className="h-full w-full object-cover" alt="Suggula's Kitchen logo" />
            </div>
            <div>
              <p className={`text-xs uppercase tracking-[0.35em] ${isAdminPage ? 'text-[#b8e532]' : 'text-[#4d9f16]'}`}>Suggula's Kitchen</p>
              <h1 className={`mt-1 font-serif text-xl sm:text-2xl ${isAdminPage ? 'text-white' : 'text-[#27301e]'}`}>{title}</h1>
              <p className={`mt-1 max-w-2xl text-sm ${isAdminPage ? 'text-white/60' : 'text-[#6f6b60]'}`}>{description}</p>
            </div>
          </Link>
          {showAuthAction && (
            <div className="flex items-center gap-3">
              {isAdminPage && isAdminAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  className="rounded-xl bg-[#ed2468] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91654]"
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
