import { useMemo, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useFetchAppData } from '../hooks/useFetchAppData'
import AboutSection from '../components/AboutSection'
import CategoriesSection from '../components/CategoriesSection'
import FooterSection from '../components/FooterSection'
import HeroSection from '../components/HeroSection'
import ProductsSection from '../components/ProductsSection'
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

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  )

  const products = appData.products || []
  const categories = appData.categories || []
  const filteredProducts = useMemo(
    () => (selectedCategory ? products.filter((product) => product.category === selectedCategory) : products),
    [products, selectedCategory]
  )

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-full bg-white/95 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setCartOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          <ShoppingCart className="h-5 w-5" />
          Cart {cartItems.length > 0 && `(${cartItems.length})`}
        </button>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        <HeroSection businessInfo={appData.businessInfo || {}} />

        {loading && <p className="text-center text-slate-500">Loading website content…</p>}
        {error && <p className="text-center text-rose-600">Failed to load content. Please try again later.</p>}

        {!loading && !error && (
          <div className="space-y-10">
            <AboutSection businessInfo={appData.businessInfo || {}} />
            <CategoriesSection
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <ProductsSection products={filteredProducts} onAddToCart={handleAddToCart} />
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
