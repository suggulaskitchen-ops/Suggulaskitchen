function SectionSkeleton({ title, children }) {
  return (
    <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50">
      <h2 className="mb-4 text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export default SectionSkeleton
