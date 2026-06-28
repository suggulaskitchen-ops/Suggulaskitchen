import { useEffect, useState } from 'react'
import { Sparkles, ImageIcon, Box, MessageSquare } from 'lucide-react'
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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        <section className="rounded-[2rem] bg-slate-900/90 p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Admin Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Manage your homemade food business</h1>
            </div>
            <p className="text-sm text-slate-300">Current phase: data-driven admin dashboard skeleton.</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard title="Products" value={counts?.products ?? '--'} description="Total products available." Icon={Box} />
          <AdminStatCard title="Categories" value={counts?.categories ?? '--'} description="Total managed categories." Icon={Sparkles} />
          <AdminStatCard title="Gallery" value={counts?.gallery ?? '--'} description="Total gallery items." Icon={ImageIcon} />
          <AdminStatCard title="Testimonials" value={counts?.testimonials ?? '--'} description="Customer reviews stored." Icon={MessageSquare} />
        </section>

        {loading && <p className="text-center text-slate-400">Loading dashboard metrics…</p>}
        {error && <p className="text-center text-rose-400">{error}</p>}

        <section className="grid gap-6 lg:grid-cols-2">
          <AdminModuleCard title="Business Information" description="Edit business details, contact info, and branding settings." />
          <AdminModuleCard title="Categories" description="Create, update, hide, and reorder menu categories." />
          <AdminModuleCard title="Products" description="Manage product details, pricing, availability, and images." />
          <AdminModuleCard title="Gallery" description="Upload gallery assets and control visibility on the website." />
        </section>

        <section className="rounded-[2rem] bg-slate-900/75 p-8 shadow-sm shadow-slate-800/60">
          <h2 className="text-2xl font-semibold text-white">What’s next?</h2>
          <p className="mt-4 max-w-3xl text-slate-400">This core admin dashboard will expand into full CRUD modules for business settings, categories, products, gallery, testimonials, and website contact details in the next phase.</p>
        </section>
      </div>
    </main>
  )
}

export default AdminPage
