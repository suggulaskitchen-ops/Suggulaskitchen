function CategoriesSection({ categories, selectedCategory, onSelectCategory }) {
  return (
    <section id="categories" className="rounded-[2rem] bg-white p-8 shadow-sm shadow-slate-200/70">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Categories</p>
          <h2 className="text-3xl font-semibold text-slate-900">Explore our menu categories</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onSelectCategory('')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === '' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === category.name ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length > 0 ? (
          categories.map((category) => (
            <article key={category.id} className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
              <div className="mb-5 h-48 overflow-hidden rounded-3xl bg-slate-100">
                <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-900">{category.name}</h3>
                {category.priceRange && <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-sm font-semibold text-emerald-700">{category.priceRange}</span>}
              </div>
              <p className="mt-3 text-slate-600">{category.description}</p>
              <button
                type="button"
                onClick={() => onSelectCategory(category.name)}
                className="mt-6 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
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
