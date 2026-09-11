import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { createGalleryItem, deleteGalleryItem, fetchGalleryItems, updateGalleryItem, uploadImage } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ImagePicker from '../components/ImagePicker'
import StatusBanner from '../components/StatusBanner'

const initialForm = {
  title: '',
  imageUrl: '',
  mediaType: 'image',
  mediaUrl: '',
  description: '',
  status: 'active'
}

function AdminGallery() {
  const location = useLocation()
  const [gallery, setGallery] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchGalleryItems()
        setGallery(result)
      } catch {
        setStatus({ type: 'error', message: 'Unable to load gallery.' })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setEditing(false)
    setStatus(null)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = (item) => {
    setForm({ ...initialForm, ...item, mediaType: item.mediaType || 'image', mediaUrl: item.mediaUrl || '' })
    setEditing(true)
    setStatus(null)
  }

  const handleDelete = async (id) => {
    setSaving(true)
    setStatus(null)
    try {
      await deleteGalleryItem(id)
      setGallery((prev) => prev.filter((item) => item.id !== id))
      setStatus({ type: 'success', message: 'Gallery item deleted.' })
    } catch {
      setStatus({ type: 'error', message: 'Unable to delete gallery item.' })
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.mediaType === 'image' && !form.imageUrl) {
      setStatus({ type: 'error', message: 'Upload an image before saving an image gallery item.' })
      return
    }

    if (form.mediaType !== 'image' && !form.mediaUrl) {
      setStatus({ type: 'error', message: 'Enter a social media URL before saving this gallery item.' })
      return
    }

    setSaving(true)
    setStatus(null)

    try {
      if (editing && form.id) {
        const updated = await updateGalleryItem(form.id, form)
        setGallery((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        setStatus({ type: 'success', message: 'Gallery item updated.' })
      } else {
        const created = await createGalleryItem(form)
        setGallery((prev) => [created, ...prev])
        setStatus({ type: 'success', message: 'Gallery item created.' })
      }
      resetForm()
    } catch (error) {
      setStatus({ type: 'error', message: error?.message || 'Unable to save gallery item.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      <div className="flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Gallery Management</h1>
          <p className="mt-2 text-sm text-slate-400">Upload and manage gallery images to display on the customer website.</p>
        </div>
        <span className="hidden rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 sm:inline-block">{location.pathname}</span>
      </div>

      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Image Title</span>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <div className="space-y-1.5 lg:col-span-2">
            <ImagePicker value={form.imageUrl} onChange={handleChange} onUpload={uploadImage} />
          </div>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Media type</span>
            <select name="mediaType" value={form.mediaType} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option value="image">Image upload</option>
              <option value="instagram">Instagram post or reel</option>
              <option value="youtube">YouTube video</option>
              <option value="facebook">Facebook post or video</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Social media URL</span>
            <input name="mediaUrl" type="url" value={form.mediaUrl} onChange={handleChange} placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <label className="space-y-1.5 lg:col-span-2">
            <span className="text-sm font-medium text-slate-300">Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Status</span>
            <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
            {editing ? 'Update Gallery Item' : 'Add Gallery Item'}
          </button>
        </div>
      </form>

      <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
        <table className="w-full min-w-[1050px] text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 bg-slate-800/50 text-xs font-medium uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Image URL</th>
              <th className="px-6 py-4">Social URL</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {gallery.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-slate-800/30">
                <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                <td className="max-w-xs px-6 py-4">
                  {item.imageUrl ? (
                    <a href={item.imageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300">
                      <img src={item.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                      <span className="truncate">{item.imageUrl}</span>
                    </a>
                  ) : (
                    <span className="text-slate-500">Not uploaded</span>
                  )}
                </td>
                <td className="max-w-xs px-6 py-4">
                  {item.mediaUrl ? (
                    <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="block max-w-xs truncate text-sky-400 hover:text-sky-300">
                      {item.mediaUrl}
                    </a>
                  ) : (
                    <span className="text-slate-500">Not provided</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => handleEdit(item)} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">Edit</button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="text-sm font-medium text-rose-400 hover:text-rose-300">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {gallery.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No gallery items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminGallery
