function AdminStatCard({ title, value, description, Icon }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{title}</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">{value}</p>
        </div>
        {Icon && <Icon className="h-10 w-10 text-emerald-600" />}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  )
}

export default AdminStatCard
