import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { Clock3, Leaf, ShoppingCart, UtensilsCrossed, Search, X } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useFetchAppData } from '../hooks/useFetchAppData'
import AboutSection from '../components/AboutSection'
import CategoriesSection from '../components/CategoriesSection'
import FooterSection from '../components/FooterSection'
import HeroSection from '../components/HeroSection'
import ProductsSection from '../components/ProductsSection'
import GallerySection from '../components/GallerySection'
import CartSidebar from '../components/CartSidebar'

function CustomerPage() {
  const { appData, loading, error } = useAppContext()
  useFetchAppData()

  const [selectedCategory, setSelectedCategory] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [navbarContainer, setNavbarContainer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  useEffect(() => {
    setNavbarContainer(document.getElementById('navbar-actions'))
  }, [])

  useEffect(() => {
    setCartOpen(false)
  }, [location.pathname, location.search, location.hash])

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const handleUpdateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleClearCart = () => {
    setCartItems([])
  }

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    requestAnimationFrame(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.currentPrice ?? item.offerPrice ?? item.price ?? 0) * item.quantity, 0),
    [cartItems]
  )

  const products = appData.products || []
  const categories = appData.categories || []
  const filteredProducts = useMemo(() => {
    let result = products
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((product) => 
        product.name?.toLowerCase().includes(q) || 
        product.shortDescription?.toLowerCase().includes(q) || 
        product.ingredients?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q)
      )
    }
    return result
  }, [products, selectedCategory, searchQuery])

  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#26351c]">
      {navbarContainer && createPortal(
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="w-24 rounded-full border border-gray-200 bg-white/80 py-1.5 pl-8 pr-8 text-sm focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all focus:w-40 sm:w-40 sm:focus:w-64"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCartOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-white shadow-sm transition-all hover:scale-105 hover:bg-rose-700 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Cart</span> {cartItems.length > 0 && `(${cartItems.length})`}
          </button>
        </div>,
        navbarContainer
      )}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-1 py-2 sm:gap-8 sm:px-2">
        <HeroSection businessInfo={appData.businessInfo || {}} products={products} />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="group flex items-center gap-4 rounded-2xl border border-transparent bg-white p-5 shadow-sm shadow-black/5 transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-black/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100"><UtensilsCrossed className="h-5 w-5" /></div>
            <span><strong className="block text-sm font-semibold text-[#26351c]">{products.filter(p => p.availability !== 'unavailable').length} dishes</strong><small className="text-sm text-[#65705d]">Available now</small></span>
          </div>
          <div className="group flex items-center gap-4 rounded-2xl border border-transparent bg-white p-5 shadow-sm shadow-black/5 transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-black/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors group-hover:bg-green-100"><Leaf className="h-5 w-5" /></div>
            <span><strong className="block text-sm font-semibold text-[#26351c]">100% homemade</strong><small className="text-sm text-[#65705d]">Fresh ingredients</small></span>
          </div>
          <div className="group flex items-center gap-4 rounded-2xl border border-transparent bg-white p-5 shadow-sm shadow-black/5 transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-black/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100"><Clock3 className="h-5 w-5" /></div>
            <span><strong className="block text-sm font-semibold text-[#26351c]">Quick ordering</strong><small className="text-sm text-[#65705d]">WhatsApp checkout</small></span>
          </div>
        </div>

        {error && <p className="border-y border-red-200 bg-red-50 py-5 text-center text-sm text-red-700">We’re refreshing the kitchen board. Please try again shortly.</p>}

        {!error && (
          <div className="space-y-7 sm:space-y-8">
            <AboutSection businessInfo={appData.businessInfo || {}} />
            <CategoriesSection
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              loading={loading}
            />
            <ProductsSection
              products={filteredProducts}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              loading={loading}
            />
            <GallerySection items={appData.gallery || []} />
          </div>
        )}

        <FooterSection businessInfo={appData.businessInfo || {}} socialLinks={appData.socialLinks || []} />
      </div>

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        businessInfo={appData.businessInfo || {}}
        cartItems={cartItems}
        total={total}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </main>
  )
}

export default CustomerPage
