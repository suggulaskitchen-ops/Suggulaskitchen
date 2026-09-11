import FallbackImage from './FallbackImage'
import ProductSkeleton from './ProductSkeleton'
import { SearchX } from 'lucide-react'

function ProductsSection({ products, categories = [], selectedCategory = '', onSelectCategory = () => {}, onAddToCart = () => {}, loading = false }) {
  return (
    <section id="products" className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-7">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#4d9f16]">Featured products</p>
          <h2 className="text-3xl font-semibold text-slate-900">{selectedCategory ? `${selectedCategory} dishes` : 'Choose your favorite dish'}</h2>
        </div>
      </div>
      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => onSelectCategory('')}
          className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${selectedCategory === '' ? 'bg-[#ed2468] text-white' : 'bg-[#f5f0e8] text-slate-700 hover:bg-[#f8e0e8]'}`}
        >
          All dishes
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.name)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${selectedCategory === category.name ? 'bg-[#ed2468] text-white' : 'bg-[#f5f0e8] text-slate-700 hover:bg-[#f8e0e8]'}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="grid items-stretch gap-4 auto-rows-fr sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : products.length > 0 ? (
          products.map((product) => {
            const currentPrice = Number(product.currentPrice ?? product.offerPrice ?? product.price ?? 0)
            const actualPrice = Number(product.actualPrice ?? product.price ?? currentPrice)
            const hasOffer = actualPrice > currentPrice

            return (
              <article key={product.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
                <div className="mb-4 overflow-hidden rounded-2xl bg-white">
                  <FallbackImage src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" fallbackClassName="h-48" />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                      {product.bestSeller && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">Best seller</span>}
                    </div>
                    <p className="mt-2 text-slate-600">{product.shortDescription}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-[#ed2468] px-4 py-2 text-sm font-semibold text-white">₹{currentPrice}</span>
                    {hasOffer && <p className="mt-2 text-xs text-slate-500 line-through">₹{actualPrice}</p>}
                  </div>
                </div>
                <div className="mt-4 flex min-h-7 flex-nowrap items-center gap-2 overflow-hidden text-xs text-slate-500">
                  <span className="shrink-0 rounded-full bg-white px-3 py-1">{product.category}</span>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1">{product.veg ? 'Veg' : 'Non Veg'}</span>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1">{product.preparationTime || 0} min</span>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="mt-auto inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#4d9f16] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#39800c]"
                >
                  Add to cart
                </button>
              </article>
            )
          })
        ) : (
          <div className="col-span-full py-16 text-center">
            <SearchX className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900">No dishes found</h3>
            <p className="mt-1 text-slate-500">We couldn't find any dishes matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsSection
