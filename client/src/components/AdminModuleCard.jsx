function AdminModuleCard({ title, description }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/40 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  )
}

export default AdminModuleCard
