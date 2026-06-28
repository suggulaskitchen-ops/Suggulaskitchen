function HeroSection({ businessInfo }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-slate-900 to-slate-700 px-6 py-16 text-white shadow-2xl shadow-slate-900/20 sm:px-10">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">{businessInfo.tagline || 'Fresh homemade recipes'}</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            {businessInfo.name || "Suggula's Kitchen"}
          </h1>
          <p className="max-w-xl text-base leading-8 text-emerald-100">
            {businessInfo.description || 'Fresh homemade meals handcrafted with love and delivered ready to enjoy.'}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href="#products" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              View Menu
            </a>
          </div>
        </div>
        <div className="grid h-72 w-full grid-cols-2 gap-4 sm:h-80 lg:w-[420px]">
          <div className="rounded-[1.75rem] bg-white/10 p-4 backdrop-blur-sm">
            <div className="h-full rounded-[1.35rem] bg-emerald-500/20 p-4" />
          </div>
          <div className="rounded-[1.75rem] bg-white/10 p-4 backdrop-blur-sm">
            <div className="h-full rounded-[1.35rem] bg-slate-900/20 p-4" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
