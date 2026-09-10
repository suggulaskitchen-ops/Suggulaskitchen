import { useEffect, useState } from 'react'
import { Sparkles, ImageIcon, Box } from 'lucide-react'
import { fetchDashboardCounts } from '../services/api'
import AdminModuleCard from '../components/AdminModuleCard'
import AdminStatCard from '../components/AdminStatCard'

function AdminPage() {
  const [counts, setCounts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadCounts() {
      try {
        const result = await fetchDashboardCounts()
        setCounts(result)
      } catch (error) {
        setError('Failed to load dashboard counts.')
      } finally {
        setLoading(false)
      }
    }

    loadCounts()
  }, [])

  return (
    <main className="text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-3xl bg-slate-900/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#c7d79d]">Operations desk</p>
                <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Keep the kitchen moving</h1>
            </div>
            <p className="text-sm text-slate-300">Content, orders, and delivery in one place.</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AdminStatCard title="Products" value={counts?.products ?? '--'} description="Total products available." Icon={Box} />
          <AdminStatCard title="Categories" value={counts?.categories ?? '--'} description="Total managed categories." Icon={Sparkles} />
          <AdminStatCard title="Gallery" value={counts?.gallery ?? '--'} description="Total gallery items." Icon={ImageIcon} />
        </section>

        {loading && <p className="text-center text-slate-400">Loading dashboard metrics…</p>}
        {error && <p className="text-center text-rose-400">{error}</p>}

        <section className="grid gap-4 sm:grid-cols-2">
          <AdminModuleCard path="/admin/business" title="Business Information" description="Edit business details, contact info, and branding settings." />
          <AdminModuleCard path="/admin/categories" title="Categories" description="Create, update, hide, and reorder menu categories." />
          <AdminModuleCard path="/admin/products" title="Products" description="Manage product details, pricing, availability, and images." />
          <AdminModuleCard path="/admin/gallery" title="Gallery" description="Upload gallery assets and control visibility on the website." />
        </section>

        <section className="rounded-3xl border border-white/5 bg-slate-900/75 p-6 shadow-sm shadow-slate-800/60">
          <h2 className="text-2xl font-semibold text-white">Today’s focus</h2>
          <p className="mt-2 max-w-3xl text-slate-400">Keep product availability, customer-facing content, and delivery status current.</p>
        </section>
      </div>
    </main>
  )
}

export default AdminPage
