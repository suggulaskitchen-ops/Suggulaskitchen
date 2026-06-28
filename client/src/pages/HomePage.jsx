import { useMemo, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useFetchAppData } from '../hooks/useFetchAppData'
import AboutSection from '../components/AboutSection'
import CategoriesSection from '../components/CategoriesSection'
import FooterSection from '../components/FooterSection'
import HeroSection from '../components/HeroSection'
import ProductsSection from '../components/ProductsSection'

function HomePage() {
  const { appData, loading, error } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState('')

  useFetchAppData()

  const products = appData.products || []
  const categories = appData.categories || []
  const filteredProducts = useMemo(
    () => (selectedCategory ? products.filter((product) => product.category === selectedCategory) : products),
    [products, selectedCategory]
  )

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        <HeroSection businessInfo={appData.businessInfo || {}} />

        {loading && <p className="text-center text-slate-500">Loading website content…</p>}
        {error && <p className="text-center text-rose-600">Failed to load content. Please try again later.</p>}

        {!loading && !error && (
          <>
            <AboutSection businessInfo={appData.businessInfo || {}} />
            <CategoriesSection
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <ProductsSection products={filteredProducts} />
            <FooterSection businessInfo={appData.businessInfo || {}} socialLinks={appData.socialLinks || []} />
          </>
        )}
      </div>
    </main>
  )
}

export default HomePage
