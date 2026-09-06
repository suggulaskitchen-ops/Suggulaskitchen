function AboutSection({ businessInfo }) {
  return (
    <section id="about" className="rounded-[2rem] bg-white p-8 shadow-sm shadow-slate-200/70">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">About us</p>
          <h2 className="text-3xl font-semibold text-slate-900">{businessInfo.aboutTitle || 'Homemade food with heart and heritage'}</h2>
          <p className="max-w-2xl text-slate-600">{businessInfo.about || 'Our kitchen brings traditional recipes together with fresh ingredients and thoughtful presentation, making every meal feel special.'}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Mission</h3>
            <p className="mt-3 text-slate-600">{businessInfo.mission || 'Deliver fresh homemade meals with exceptional flavor and care.'}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Vision</h3>
            <p className="mt-3 text-slate-600">{businessInfo.vision || 'Be the go-to homemade meals experience for busy families and food lovers.'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
