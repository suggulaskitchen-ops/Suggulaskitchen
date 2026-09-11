import { useEffect, useState } from 'react'
import { Sparkles, ImageIcon, Box, ArrowUpRight, CheckCircle } from 'lucide-react'
import { fetchDashboardCounts } from '../services/api'
import { Link } from 'react-router-dom'

function BentoModule({ title, description, path, spanClass, bgClass, textClass, iconClass }) {
  return (
    <Link to={path} className={`group relative overflow-hidden rounded-[2rem] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${spanClass} ${bgClass} ${textClass}`}>
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
          <p className="mt-3 max-w-sm leading-relaxed opacity-80">{description}</p>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-widest opacity-90">Open Workspace</span>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 ${iconClass}`}>
            <ArrowUpRight className="h-6 w-6" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function BentoStat({ title, value, description, Icon }) {
  return (
    <div className="group flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{title}</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3.5 text-emerald-600 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{description}</p>
    </div>
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
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        {error && <div className="rounded-2xl bg-rose-500/10 p-4 text-center text-sm font-semibold text-rose-400">{error}</div>}

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Hero Block (2x2) */}
          <div className="flex flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1e2916] to-[#2b3a1f] p-8 text-white shadow-xl md:col-span-2 md:row-span-2 lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#c7d79d]">Operations Desk</p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">Keep the kitchen moving.</h1>
              <p className="mt-5 max-w-sm text-lg text-white/70">Content, orders, and delivery tracking all in one central place.</p>
            </div>
            <div className="mt-12 flex items-center gap-3">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-emerald-400">System online and ready</span>
            </div>
          </div>

          {/* Stats (1x1 each) */}
          <BentoStat title="Products" value={counts?.products ?? (loading ? '...' : '--')} description="Total products available." Icon={Box} />
          <BentoStat title="Categories" value={counts?.categories ?? (loading ? '...' : '--')} description="Total managed categories." Icon={Sparkles} />
          <BentoStat title="Gallery" value={counts?.gallery ?? (loading ? '...' : '--')} description="Total gallery items." Icon={ImageIcon} />

          {/* Today's Focus (1x1) */}
          <div className="group flex flex-col justify-between rounded-[2rem] bg-rose-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <div>
              <div className="mb-4 inline-flex rounded-xl bg-rose-200/50 p-3 text-rose-700">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-rose-950">Today's Focus</h3>
            </div>
            <p className="mt-2 text-sm font-medium leading-relaxed text-rose-800/80">Keep availability & delivery status updated.</p>
          </div>

          {/* Module Cards */}
          <BentoModule 
            title="Business Info" 
            description="Edit business details, contact info, and core branding settings." 
            path="/admin/business" 
            spanClass="md:col-span-2 lg:col-span-2" 
            bgClass="bg-[#24301b]" 
            textClass="text-white" 
            iconClass="bg-white/10 text-white" 
          />
          <BentoModule 
            title="Categories" 
            description="Create, hide, and reorder your menu categories." 
            path="/admin/categories" 
            spanClass="md:col-span-1 lg:col-span-1" 
            bgClass="bg-emerald-50" 
            textClass="text-emerald-950" 
            iconClass="bg-emerald-200/50 text-emerald-800" 
          />
          <BentoModule 
            title="Products" 
            description="Manage product pricing, details, and feature images." 
            path="/admin/products" 
            spanClass="md:col-span-1 lg:col-span-1" 
            bgClass="bg-slate-100" 
            textClass="text-slate-900" 
            iconClass="bg-slate-200 text-slate-700" 
          />
          <BentoModule 
            title="Gallery" 
            description="Upload beautiful gallery assets and control their visibility on the website." 
            path="/admin/gallery" 
            spanClass="md:col-span-2 lg:col-span-4" 
            bgClass="bg-rose-600" 
            textClass="text-white" 
            iconClass="bg-black/10 text-white" 
          />
          
        </section>
      </div>
    </main>
  )
}

export default AdminPage
