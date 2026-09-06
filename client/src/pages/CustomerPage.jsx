import { useMemo, useState } from 'react'
import { Clock3, Leaf, ShoppingCart, UtensilsCrossed } from 'lucide-react'
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
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
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
  const filteredProducts = useMemo(
    () => (selectedCategory ? products.filter((product) => product.category === selectedCategory) : products),
    [products, selectedCategory]
  )

  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#26351c]">
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl border border-[#d8cebd] bg-[#fffdf8]/95 p-2 shadow-xl shadow-[#6f6b60]/15 backdrop-blur-sm sm:bottom-auto sm:top-5 sm:right-8">
        <button
          type="button"
          onClick={() => setCartOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl bg-[#4d9f16] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#39800c]"
        >
          <ShoppingCart className="h-5 w-5" />
          Cart {cartItems.length > 0 && `(${cartItems.length})`}
        </button>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-1 py-2 sm:gap-8 sm:px-2">
        <HeroSection businessInfo={appData.businessInfo || {}} products={products} />

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#f0d5dc] bg-[#fffdf8] p-4"><UtensilsCrossed className="h-5 w-5 text-[#ed2468]" /><span><strong className="block text-sm text-[#26351c]">{products.length} dishes</strong><small className="text-xs text-[#65705d]">Made today</small></span></div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#d6e7b9] bg-[#fffdf8] p-4"><Leaf className="h-5 w-5 text-[#4d9f16]" /><span><strong className="block text-sm text-[#26351c]">100% homemade</strong><small className="text-xs text-[#65705d]">Fresh ingredients</small></span></div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#f0d5dc] bg-[#fffdf8] p-4"><Clock3 className="h-5 w-5 text-[#ed2468]" /><span><strong className="block text-sm text-[#26351c]">Quick ordering</strong><small className="text-xs text-[#65705d]">WhatsApp checkout</small></span></div>
        </div>

        {loading && <p className="border-y border-[#d8cebd] py-5 text-center text-sm text-[#6f6b60]">Preparing today’s menu...</p>}
        {error && <p className="border-y border-red-200 bg-red-50 py-5 text-center text-sm text-red-700">We’re refreshing the kitchen board. Please try again shortly.</p>}

        {!loading && !error && (
          <div className="space-y-7 sm:space-y-8">
            <AboutSection businessInfo={appData.businessInfo || {}} />
            <CategoriesSection
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
            <ProductsSection
              products={filteredProducts}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onAddToCart={handleAddToCart}
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
