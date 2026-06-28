function ProductsSection({ products, onAddToCart }) {
  return (
    <section id="products" className="rounded-[2rem] bg-white p-8 shadow-sm shadow-slate-200/70">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Featured products</p>
          <h2 className="text-3xl font-semibold text-slate-900">Choose your favorite dish</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.length > 0 ? (
          products.map((product) => {
            const hasOffer = product.offerPrice && product.offerPrice < product.price

            return (
              <article key={product.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
                <div className="mb-5 overflow-hidden rounded-3xl bg-white">
                  <img src={product.imageUrl} alt={product.name} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
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
                    <span className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">₹{product.price}</span>
                    {hasOffer && <p className="mt-2 text-xs text-slate-500 line-through">₹{product.offerPrice}</p>}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1">{product.category}</span>
                  <span className="rounded-full bg-white px-3 py-1">{product.veg ? 'Veg' : 'Non Veg'}</span>
                  <span className="rounded-full bg-white px-3 py-1">{product.preparationTime} min</span>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Add to cart
                </button>
              </article>
            )
          })
        ) : (
          <p className="text-slate-500">No products found at the moment.</p>
        )}
      </div>
    </section>
  )
}

export default ProductsSection
