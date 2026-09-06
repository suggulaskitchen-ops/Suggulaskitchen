import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function AdminModuleCard({ title, description, path }) {
  return (
    <Link to={path} className="group block rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/40 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">Open workspace <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
    </Link>
  )
}

export default AdminModuleCard
