import { useEffect, useState } from 'react'
import { createCategory, deleteCategory, fetchCategories, updateCategory, uploadImage } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ImagePicker from '../components/ImagePicker'
import StatusBanner from '../components/StatusBanner'

const initialForm = {
  name: '',
  image_id: null,
  imageUrl: '',
  description: '',
  priceRange: '',
  status: 'active',
  featured: false
}

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchCategories()
        setCategories(result)
      } catch {
        setStatus({ type: 'error', message: 'Unable to load categories.' })
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
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEdit = (category) => {
    setForm(category)
    setEditing(true)
    setStatus(null)
  }

  const handleDelete = async (id) => {
    setSaving(true)
    setStatus(null)
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((item) => item.id !== id))
      setStatus({ type: 'success', message: 'Category deleted.' })
    } catch {
      setStatus({ type: 'error', message: 'Unable to delete category.' })
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
        const updated = await updateCategory(form.id, form)
        setCategories((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        setStatus({ type: 'success', message: 'Category updated successfully.' })
      } else {
        const created = await createCategory(form)
        setCategories((prev) => [created, ...prev])
        setStatus({ type: 'success', message: 'Category created successfully.' })
      }
      resetForm()
    } catch {
      setStatus({ type: 'error', message: 'Unable to save category.' })
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
          <h1 className="text-3xl font-semibold tracking-tight text-white">Category Management</h1>
          <p className="mt-2 text-sm text-slate-400">Create, update, hide, and reorder menu categories for the customer website.</p>
        </div>
        <span className="hidden rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 sm:inline-block">{location.pathname}</span>
      </div>

      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Category Name</span>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Price Range</span>
            <input name="priceRange" value={form.priceRange} onChange={handleChange} placeholder="₹120 - ₹250" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <div className="sm:col-span-2">
            <ImagePicker value={form.imageUrl} onChange={handleChange} onUpload={uploadImage} />
          </div>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-slate-300">Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-white/5 bg-slate-800/20 p-4">
          <label className="flex items-center gap-3">
            <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm text-slate-300">Featured category</span>
          </label>
          <label className="flex items-center gap-3">
            <input name="status" value="active" type="radio" checked={form.status === 'active'} onChange={handleChange} className="h-4 w-4 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm text-slate-300">Active</span>
          </label>
          <label className="flex items-center gap-3">
            <input name="status" value="hidden" type="radio" checked={form.status === 'hidden'} onChange={handleChange} className="h-4 w-4 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm text-slate-300">Hidden</span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
            {editing ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
        <table className="w-full min-w-[680px] text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 bg-slate-800/50 text-xs font-medium uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Price Range</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((category) => (
              <tr key={category.id} className="transition-colors hover:bg-slate-800/30">
                <td className="px-6 py-4 font-medium text-white">{category.name}</td>
                <td className="px-6 py-4 text-slate-400">{category.priceRange || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${category.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {category.featured ? <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">Featured</span> : 'No'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => handleEdit(category)} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">Edit</button>
                    <button type="button" onClick={() => handleDelete(category.id)} className="text-sm font-medium text-rose-400 hover:text-rose-300">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminCategories
