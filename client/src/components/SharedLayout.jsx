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
      <header className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all ${isAdminPage ? 'border-b border-white/10 bg-[#24301b]/85 py-4 text-white' : 'bg-[#fffaf3]/85 text-[#27301e] shadow-sm border-b border-[#d8cebd]/50 py-3'}`}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to={isAdminPage ? '/admin' : '/customer'} className="group flex items-center gap-3 transition-all hover:opacity-80">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl ${isAdminPage ? 'bg-[#fffaf3]' : 'bg-white shadow-sm border border-[#e6dccb]'}`}>
              <Logo className="h-full w-full object-cover p-0.5 transition-transform group-hover:scale-105" alt="Suggula's Kitchen logo" />
            </div>
            <div className="flex flex-col">
              <h1 className={`font-serif text-[1.35rem] leading-tight font-semibold tracking-tight ${isAdminPage ? 'text-white' : 'text-[#27301e]'}`}>
                {title}
              </h1>
              {isAdminPage && <p className="text-xs text-white/60">{description}</p>}
            </div>
          </Link>
          <div id="navbar-actions" className="flex items-center gap-3">
            {showAuthAction && (
              <>
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
                    className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    Admin login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        {children ?? <Outlet />}
      </main>
    </div>
  )
}

export default SharedLayout
