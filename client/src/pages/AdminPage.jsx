import { useEffect, useState } from 'react'
import { Sparkles, ImageIcon, Box, ChevronRight, Activity } from 'lucide-react'
import { fetchDashboardCounts } from '../services/api'
import { Link } from 'react-router-dom'

function CompactStat({ title, value, Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-slate-800/30 p-5 transition hover:bg-slate-800/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}

function ListModule({ title, description, path }) {
  return (
    <Link to={path} className="group flex items-center justify-between p-5 transition hover:bg-slate-800/40">
      <div>
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-500 transition group-hover:text-white" />
    </Link>
  )
}

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
    <main className="pb-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header Section */}
        <div className="flex items-end justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Operations Desk</h1>
            <p className="mt-2 text-sm text-slate-400">Manage Suggula's Kitchen content, inventory, and deliveries.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 sm:flex">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">System Active</span>
          </div>
        </div>

        {error && <div className="rounded-lg bg-rose-500/10 p-4 text-sm text-rose-400">{error}</div>}

        {/* Stats Row */}
        <div>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-500">Key Metrics</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CompactStat title="Products" value={counts?.products ?? (loading ? '...' : '--')} Icon={Box} />
            <CompactStat title="Categories" value={counts?.categories ?? (loading ? '...' : '--')} Icon={Sparkles} />
            <CompactStat title="Gallery" value={counts?.gallery ?? (loading ? '...' : '--')} Icon={ImageIcon} />
          </div>
        </div>

        {/* Workspaces List */}
        <div>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-500">Workspaces</h2>
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50">
            <div className="divide-y divide-white/5">
              <ListModule 
                title="Business Information" 
                description="Edit business details, contact info, and core branding settings." 
                path="/admin/business" 
              />
              <ListModule 
                title="Categories" 
                description="Create, hide, and reorder your menu categories." 
                path="/admin/categories" 
              />
              <ListModule 
                title="Products" 
                description="Manage product pricing, details, and feature images." 
                path="/admin/products" 
              />
              <ListModule 
                title="Gallery" 
                description="Upload gallery assets and control their visibility on the website." 
                path="/admin/gallery" 
              />
            </div>
          </div>
        </div>

        {/* Additional Section */}
        <div className="rounded-2xl border border-white/5 bg-slate-800/20 p-6">
          <h3 className="text-base font-medium text-white">Today's Focus</h3>
          <p className="mt-2 text-sm text-slate-400">Ensure product availability matches kitchen capacity and keep delivery statuses updated.</p>
        </div>

      </div>
    </main>
  )
}

export default AdminPage
