import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

function HeroSection({ businessInfo, products = [] }) {
  const navigate = useNavigate()
  
  const defaultImageUrl = `${import.meta.env.BASE_URL}images/product.svg`
  const heroImageUrl = businessInfo.heroImageUrl1 || products[0]?.imageUrl || defaultImageUrl
  const bgColor = businessInfo.hero_bg_color || '#307a2a'

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
    <section className="relative overflow-hidden rounded-3xl text-white shadow-2xl shadow-black/20" style={{ backgroundColor: bgColor }}>
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.05),transparent_48%,rgba(0,0,0,0.2))]" />
      <div className="relative grid items-stretch lg:grid-cols-2">
        <div className="flex max-w-xl flex-col justify-center space-y-6 p-8 sm:p-12 lg:py-16">
          <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#b8e532] shadow-sm backdrop-blur-sm">
            {businessInfo.tagline || 'Fresh homemade recipes'}
          </div>
          <h2 className="text-4xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-[3.5rem]">
            {businessInfo.name ? `${businessInfo.name}. Made fresh.` : 'Traditional Taste. Made for today.'}
          </h2>
          <p className="text-base font-medium leading-relaxed text-white/90">
            {businessInfo.description || 'Fresh homemade meals handcrafted with love and delivered ready to enjoy.'}
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <button onClick={goToProducts} className="inline-flex items-center justify-center rounded-full bg-[#b8e532] px-8 py-3.5 text-sm font-bold text-green-950 transition hover:-translate-y-0.5 hover:bg-[#a3d120]">
              Shop Now <span className="ml-2 text-lg leading-none">›</span>
            </button>
            {businessInfo.phone && (
              <a href={`tel:${businessInfo.phone}`} className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/20">
                Call Now
              </a>
            )}
          </div>
        </div>
        <div className="relative min-h-[300px] w-full h-64 sm:h-80 lg:h-auto">
          <img src={heroImageUrl} alt="Featured dish" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
