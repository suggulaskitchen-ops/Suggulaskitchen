import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchBusinessInfo, updateBusinessInfo } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

function AdminBusinessInfo() {
  const [formState, setFormState] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const location = useLocation()

  useEffect(() => {
    async function load() {
      try {
        const info = await fetchBusinessInfo()
        setFormState({ ...info, socialLinks: info.socialLinks || [] })
      } catch (error) {
        setStatus({ type: 'error', message: 'Unable to load business settings.' })
      }
    }

    load()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setStatus(null)

    try {
      await updateBusinessInfo(formState)
      setStatus({ type: 'success', message: 'Business settings saved.' })
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to save business settings.' })
    } finally {
      setSaving(false)
    }
  }

  if (!formState) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6 rounded-[2rem] bg-slate-900/90 p-8 text-slate-100 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Business Information</h1>
          <p className="text-slate-400">Edit the core business content that appears on the customer website.</p>
        </div>
        <span className="rounded-full bg-emerald-600/20 px-4 py-2 text-sm text-emerald-200">{location.pathname}</span>
      </div>

      {status && (
        <div className={`rounded-3xl p-4 ${status.type === 'success' ? 'bg-emerald-600/15 text-emerald-200' : 'bg-rose-600/15 text-rose-200'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Business Name</span>
          <input name="name" value={formState.name} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Tagline</span>
          <input name="tagline" value={formState.tagline} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-200">Description</span>
          <textarea name="description" value={formState.description} onChange={handleChange} rows="4" className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Phone</span>
          <input name="phone" value={formState.phone} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">WhatsApp</span>
          <input name="whatsapp" value={formState.whatsapp} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Email</span>
          <input name="email" value={formState.email} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Address</span>
          <input name="address" value={formState.address} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Business Hours</span>
          <input name="hours" value={formState.hours} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-200">Footer Text</span>
          <textarea name="footerText" value={formState.footerText} onChange={handleChange} rows="3" className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>

        <div className="lg:col-span-2 space-y-4 rounded-[1.75rem] border border-slate-700 bg-slate-950 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-200">Social Links</p>
              <p className="text-sm text-slate-400">Add links displayed in the footer.</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormState((prev) => ({
                  ...prev,
                  socialLinks: [...(prev.socialLinks || []), { platform: '', url: '' }]
                }))
              }
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-400"
            >
              Add link
            </button>
          </div>

          {(formState.socialLinks || []).map((link, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-slate-200">Platform</span>
                  <input
                    value={link.platform}
                    onChange={(event) => {
                      const updatedLinks = [...formState.socialLinks]
                      updatedLinks[index] = { ...updatedLinks[index], platform: event.target.value }
                      setFormState((prev) => ({ ...prev, socialLinks: updatedLinks }))
                    }}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-200">URL</span>
                  <input
                    value={link.url}
                    onChange={(event) => {
                      const updatedLinks = [...formState.socialLinks]
                      updatedLinks[index] = { ...updatedLinks[index], url: event.target.value }
                      setFormState((prev) => ({ ...prev, socialLinks: updatedLinks }))
                    }}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updatedLinks = (formState.socialLinks || []).filter((_, itemIndex) => itemIndex !== index)
                  setFormState((prev) => ({ ...prev, socialLinks: updatedLinks }))
                }}
                className="rounded-full bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="lg:col-span-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Business Settings'}
        </button>
      </form>
    </div>
  )
}

export default AdminBusinessInfo
