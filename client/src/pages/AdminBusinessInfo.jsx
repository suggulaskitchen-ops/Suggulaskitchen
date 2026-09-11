import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchBusinessInfo, updateBusinessInfo, fetchGalleryItems, uploadImage } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ImagePicker from '../components/ImagePicker'

const emptyBusiness = {
  name: '',
  tagline: '',
  description: '',
  aboutTitle: '',
  about: '',
  mission: '',
  vision: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  hours: '',
  footerText: '',
  socialLinks: [],
  hero_image_1_id: '',
  hero_image_2_id: '',
  heroImageUrl1: '',
  hero_bg_color: '#26351c'
}

const normalizeBusiness = (business) => Object.keys(emptyBusiness).reduce((result, field) => {
  result[field] = field === 'socialLinks'
    ? (Array.isArray(business?.[field]) ? business[field] : [])
    : (business?.[field] ?? emptyBusiness[field])
  return result
}, {})

function AdminBusinessInfo() {
  const [formState, setFormState] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const location = useLocation()

  const [gallery, setGallery] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const [info, galleryItems] = await Promise.all([
          fetchBusinessInfo(),
          fetchGalleryItems()
        ])
        setFormState(normalizeBusiness(info))
        setGallery(galleryItems)
      } catch (error) {
        setStatus({ type: 'error', message: error?.message || 'Unable to load business settings.' })
        setFormState(normalizeBusiness({}))
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
      const saved = await updateBusinessInfo(formState)
      setFormState(normalizeBusiness(saved))
      setStatus({ type: 'success', message: 'Business settings saved.' })
    } catch (error) {
      setStatus({ type: 'error', message: error?.message || 'Failed to save business settings.' })
    } finally {
      setSaving(false)
    }
  }

  if (!formState) {
    return <LoadingSpinner />
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Business Information</h1>
          <p className="mt-2 text-sm text-slate-400">Edit the core business content that appears on the customer website.</p>
        </div>
        <span className="hidden rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 sm:inline-block">{location.pathname}</span>
      </div>

      {status && (
        <div className={`rounded-xl p-4 text-sm font-medium ${status.type === 'success' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Basic Info Section */}
        <div>
          <h2 className="mb-5 text-lg font-medium text-white">Basic Details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-300">Business Name</span>
              <input name="name" value={formState.name} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-300">Tagline</span>
              <input name="tagline" value={formState.tagline} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-slate-300">Description</span>
              <textarea name="description" value={formState.description} onChange={handleChange} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* About Section */}
        <div>
          <h2 className="mb-5 text-lg font-medium text-white">About Section</h2>
          <div className="grid gap-5">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-300">About Title</span>
              <input name="aboutTitle" value={formState.aboutTitle || ''} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-300">About Content</span>
              <textarea name="about" value={formState.about || ''} onChange={handleChange} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-300">Mission</span>
                <textarea name="mission" value={formState.mission || ''} onChange={handleChange} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-300">Vision</span>
                <textarea name="vision" value={formState.vision || ''} onChange={handleChange} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </label>
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Contact Info Section */}
        <div>
          <h2 className="mb-5 text-lg font-medium text-white">Contact & Location</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-300">Phone</span>
              <input name="phone" value={formState.phone} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-300">WhatsApp</span>
              <input name="whatsapp" value={formState.whatsapp} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <input name="email" value={formState.email} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
            <label className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <span className="text-sm font-medium text-slate-300">Address</span>
              <input name="address" value={formState.address} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
            <label className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <span className="text-sm font-medium text-slate-300">Business Hours</span>
              <input name="hours" value={formState.hours} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Branding & Footer Section */}
        <div>
          <h2 className="mb-5 text-lg font-medium text-white">Branding & Footer</h2>
          <div className="grid gap-5">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-300">Footer Text</span>
              <textarea name="footerText" value={formState.footerText} onChange={handleChange} rows="2" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </label>
            <div className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-300">Hero Section Image</span>
              <ImagePicker name="heroImageUrl1" value={formState.heroImageUrl1} onChange={handleChange} onUpload={uploadImage} />
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Social Links Section */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-white">Social Links</h2>
              <p className="text-sm text-slate-400">Manage social media links shown in the footer.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormState((prev) => ({ ...prev, socialLinks: [...(prev.socialLinks || []), { platform: '', url: '' }] }))}
              className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
            >
              + Add link
            </button>
          </div>

          <div className="space-y-3">
            {(formState.socialLinks || []).length === 0 && (
              <p className="text-sm italic text-slate-500">No social links added yet.</p>
            )}
            {(formState.socialLinks || []).map((link, index) => (
              <div key={index} className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <input
                  placeholder="Platform (e.g. Instagram)"
                  value={link.platform}
                  onChange={(event) => {
                    const updatedLinks = [...formState.socialLinks]
                    updatedLinks[index] = { ...updatedLinks[index], platform: event.target.value }
                    setFormState((prev) => ({ ...prev, socialLinks: updatedLinks }))
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 sm:w-1/3"
                />
                <input
                  placeholder="https://..."
                  value={link.url}
                  onChange={(event) => {
                    const updatedLinks = [...formState.socialLinks]
                    updatedLinks[index] = { ...updatedLinks[index], url: event.target.value }
                    setFormState((prev) => ({ ...prev, socialLinks: updatedLinks }))
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 sm:w-2/3"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedLinks = (formState.socialLinks || []).filter((_, itemIndex) => itemIndex !== index)
                    setFormState((prev) => ({ ...prev, socialLinks: updatedLinks }))
                  }}
                  className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-rose-500/20"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? 'Saving changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminBusinessInfo
