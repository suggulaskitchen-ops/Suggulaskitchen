import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import FallbackImage from './FallbackImage'

function HeroSection({ businessInfo, products = [] }) {
  const navigate = useNavigate()
  
  const defaultImageUrl = `${import.meta.env.BASE_URL}images/product.svg`
  const heroImageUrl = businessInfo.heroImageUrl1 || products[0]?.imageUrl || defaultImageUrl
  const categoryImageUrl = businessInfo.heroImageUrl2 || products[1]?.imageUrl || products[0]?.imageUrl || defaultImageUrl
  const bgColor = businessInfo.hero_bg_color || '#26351c'

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
    <section className="relative overflow-hidden rounded-3xl px-5 py-8 text-white shadow-2xl shadow-black/20 sm:px-8 sm:py-10" style={{ backgroundColor: bgColor }}>
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(184,229,50,0.2),transparent_48%,rgba(237,36,104,0.24))]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-xl space-y-5 animate-fade-in-up">
          <div className="inline-flex items-center rounded-full border border-[#b8e532]/40 bg-[#b8e532]/10 px-3 py-1 text-sm font-medium text-[#edffc0] backdrop-blur-sm">
            {businessInfo.tagline || 'Fresh homemade recipes'}
          </div>
          <h2 className="text-4xl font-semibold leading-[1.05] sm:text-5xl">Made fresh. Shared warmly.</h2>
          <p className="max-w-xl text-base leading-8 text-[#f6f4dc]">
            {businessInfo.description || 'Fresh homemade meals handcrafted with love and delivered ready to enjoy.'}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button onClick={goToProducts} className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-rose-700 active:scale-95">
              View Menu
            </button>
            {businessInfo.phone && (
              <a href={`tel:${businessInfo.phone}`} className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-white/20 active:scale-95">
                Call Now
              </a>
            )}
          </div>
        </div>
        <div className="h-64 w-full sm:h-72 lg:w-[420px] lg:shrink-0">
          <div className="h-full w-full overflow-hidden rounded-[1.75rem] bg-white/10 p-3 backdrop-blur-sm">
            <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] shadow-inner shadow-black/10">
              <FallbackImage 
                src={heroImageUrl} 
                alt="Delicious homemade food" 
                className="h-full w-full object-cover" 
                fallbackClassName="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
