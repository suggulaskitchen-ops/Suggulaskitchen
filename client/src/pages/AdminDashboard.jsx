import { Outlet, NavLink } from 'react-router-dom'
import { BarChart3, BookOpen, Boxes, Image, LayoutDashboard, PackageCheck, Truck, Users } from 'lucide-react'

const navItems = [
  { path: '/admin', label: 'Overview', Icon: LayoutDashboard },
  { path: '/admin/business', label: 'Site Content', Icon: BookOpen },
  { path: '/admin/categories', label: 'Categories', Icon: Boxes },
  { path: '/admin/products', label: 'Products', Icon: PackageCheck },
  { path: '/admin/gallery', label: 'Gallery', Icon: Image },
  { path: '/admin/customers', label: 'Customers', Icon: Users },
  { path: '/admin/orders', label: 'Orders', Icon: BarChart3 },
  { path: '/admin/shipping', label: 'Shipping', Icon: Truck }
]

function AdminDashboard() {
  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
      <nav className="lg:sticky lg:top-28 z-30 flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-[#2b3325]/95 p-2 shadow-xl shadow-black/15 backdrop-blur-md lg:flex-col">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-[#c7d79d] text-[#27301e]' : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.Icon className="mr-2 inline-block h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard
