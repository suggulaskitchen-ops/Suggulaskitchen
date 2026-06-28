function HeroSection({ businessInfo }) {
  const heroImageUrl = `${import.meta.env.BASE_URL}images/hero.svg`
  const categoryImageUrl = `${import.meta.env.BASE_URL}images/category.svg`

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-slate-900 to-slate-700 px-6 py-16 text-white shadow-2xl shadow-slate-900/20 sm:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_45%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-emerald-50 backdrop-blur-sm">
            {businessInfo.tagline || 'Fresh homemade recipes'}
          </div>
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
            {businessInfo.phone && (
              <a href={`tel:${businessInfo.phone}`} className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Call Now
              </a>
            )}
          </div>
        </div>
        <div className="grid h-72 w-full grid-cols-2 gap-4 sm:h-80 lg:w-[420px]">
          <div className="overflow-hidden rounded-[1.75rem] bg-white/10 p-3 backdrop-blur-sm">
            <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-slate-950/20">
              <img src={heroImageUrl} alt="Featured dish" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4">
                <p className="text-sm font-semibold">Freshly made</p>
                <p className="text-xs text-slate-200">Daily specials with homemade flavor</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.75rem] bg-white/10 p-3 backdrop-blur-sm">
            <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-slate-950/20">
              <img src={categoryImageUrl} alt="Menu categories" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4">
                <p className="text-sm font-semibold">Browse by category</p>
                <p className="text-xs text-slate-200">Find your perfect meal quickly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
