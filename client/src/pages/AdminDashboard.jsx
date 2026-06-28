import { Outlet, NavLink } from 'react-router-dom'

const navItems = [
  { path: '/admin', label: 'Overview' },
  { path: '/admin/business', label: 'Business Info' },
  { path: '/admin/categories', label: 'Categories' },
  { path: '/admin/products', label: 'Products' },
  { path: '/admin/gallery', label: 'Gallery' },
  { path: '/admin/testimonials', label: 'Testimonials' }
]

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <nav className="flex flex-wrap gap-3 rounded-[2rem] bg-slate-900/90 p-4 shadow-sm shadow-slate-900/50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `rounded-full px-5 py-3 text-sm font-medium transition ${
                isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}

export default AdminDashboard
