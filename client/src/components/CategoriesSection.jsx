import FallbackImage from './FallbackImage'

function CategoriesSection({ categories, onSelectCategory, loading = false }) {
  return (
    <section id="categories" className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-7">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#4d9f16]">Categories</p>
          <h2 className="text-3xl font-semibold text-slate-900">Explore our menu categories</h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 h-44 w-full rounded-2xl bg-slate-200" />
              <div className="h-6 w-1/2 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded bg-slate-200" />
              <div className="mt-5 h-11 w-full rounded-xl bg-slate-200" />
            </div>
          ))
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <article key={category.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
              <button type="button" onClick={() => onSelectCategory(category.name)} className="mb-4 block h-44 w-full overflow-hidden rounded-2xl bg-slate-100" aria-label={`Show ${category.name} products`}>
                <FallbackImage src={category.imageUrl} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" fallbackClassName="h-full" />
              </button>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{category.name}</h3>
                  {category.featured && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#4d9f16]">Featured</p>}
                </div>
                {category.priceRange && <span className="rounded-full bg-[#b8e532]/30 px-3 py-1 text-sm font-semibold text-[#39800c]">{category.priceRange}</span>}
              </div>
              <p className="mt-3 text-slate-600">{category.description}</p>
              <button
                type="button"
                onClick={() => onSelectCategory(category.name)}
                className="mt-5 rounded-xl bg-[#4d9f16] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#39800c]"
              >
                Show {category.name}
              </button>
            </article>
          ))
        ) : (
          <p className="text-slate-500">No categories available yet.</p>
        )}
      </div>
    </section>
  )
}

export default CategoriesSection
