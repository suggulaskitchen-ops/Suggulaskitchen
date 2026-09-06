import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

function HeroSection({ businessInfo, products = [] }) {
  const navigate = useNavigate()
  const heroImageUrl = products[0]?.imageUrl || `${import.meta.env.BASE_URL}images/product.svg`
  const categoryImageUrl = products[1]?.imageUrl || products[0]?.imageUrl || `${import.meta.env.BASE_URL}images/product.svg`

  const goToProducts = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault()
    // Navigate to the customer page (HashRouter will update the URL to #/customer)
    navigate('/customer')
    // Wait a short moment for the page to render, then scroll to the products section
    setTimeout(() => {
      const el = document.getElementById('products')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }, [navigate])

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#26351c] px-5 py-8 text-white shadow-2xl shadow-[#26351c]/20 sm:px-8 sm:py-10">
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(184,229,50,0.2),transparent_48%,rgba(237,36,104,0.24))]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-xl space-y-5">
          <div className="inline-flex items-center rounded-full border border-[#b8e532]/40 bg-[#b8e532]/10 px-3 py-1 text-sm font-medium text-[#edffc0] backdrop-blur-sm">
            {businessInfo.tagline || 'Fresh homemade recipes'}
          </div>
          <h2 className="text-4xl font-semibold leading-[1.05] sm:text-5xl">Made fresh. Shared warmly.</h2>
          <p className="max-w-xl text-base leading-8 text-[#f6f4dc]">
            {businessInfo.description || 'Fresh homemade meals handcrafted with love and delivered ready to enjoy.'}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button onClick={goToProducts} className="inline-flex items-center justify-center rounded-full bg-[#ed2468] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91654]">
              View Menu
            </button>
            {businessInfo.phone && (
              <a href={`tel:${businessInfo.phone}`} className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Call Now
              </a>
            )}
          </div>
        </div>
        <div className="grid h-64 w-full grid-cols-2 gap-3 sm:h-72 lg:w-[420px] lg:shrink-0">
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
