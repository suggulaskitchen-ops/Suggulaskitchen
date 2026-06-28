import { useEffect, useState } from 'react'
import { createGalleryItem, deleteGalleryItem, fetchGalleryItems, updateGalleryItem } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const initialForm = {
  title: '',
  imageUrl: '',
  description: '',
  status: 'active'
}

function AdminGallery() {
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
    setForm(item)
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
    } catch {
      setStatus({ type: 'error', message: 'Unable to save gallery item.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-8 rounded-[2rem] bg-slate-900/90 p-8 text-slate-100 shadow-2xl shadow-black/20">
      <div>
        <h1 className="text-3xl font-semibold">Gallery Management</h1>
        <p className="mt-2 text-slate-400">Upload and manage gallery images to display on the customer website.</p>
      </div>

      {status && (
        <div className={`rounded-3xl p-4 ${status.type === 'success' ? 'bg-emerald-600/15 text-emerald-200' : 'bg-rose-600/15 text-rose-200'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Image Title</span>
          <input name="title" value={form.title} onChange={handleChange} required className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Image URL</span>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-200">Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Status</span>
          <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500">
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        <button type="submit" disabled={saving} className="lg:col-span-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
          {editing ? 'Update Gallery Item' : 'Add Gallery Item'}
        </button>
      </form>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
          <thead className="bg-slate-900/90 text-slate-400">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {gallery.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">{item.title}</td>
                <td className="px-6 py-4 text-slate-300">{item.status}</td>
                <td className="px-6 py-4 space-x-2">
                  <button type="button" onClick={() => handleEdit(item)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminGallery
