import { useEffect, useState } from 'react'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ImagePicker from '../components/ImagePicker'

const initialForm = {
  name: '',
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
    <div className="space-y-8 rounded-[2rem] bg-slate-900/90 p-8 text-slate-100 shadow-2xl shadow-black/20">
      <div>
        <h1 className="text-3xl font-semibold">Category Management</h1>
        <p className="mt-2 text-slate-400">Create, update, hide, and reorder menu categories for the customer website.</p>
      </div>

      {status && (
        <div className={`rounded-3xl p-4 ${status.type === 'success' ? 'bg-emerald-600/15 text-emerald-200' : 'bg-rose-600/15 text-rose-200'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Category Name</span>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <div className="lg:col-span-2">
          <ImagePicker value={form.imageUrl} onChange={handleChange} />
        </div>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Price Range</span>
          <input name="priceRange" value={form.priceRange} onChange={handleChange} placeholder="₹120 - ₹250" className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-200">Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
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
        <button type="submit" disabled={saving} className="lg:col-span-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
          {editing ? 'Update Category' : 'Add Category'}
        </button>
      </form>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
          <thead className="bg-slate-900/90 text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Price Range</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4">{category.name}</td>
                <td className="px-6 py-4 text-slate-300">{category.priceRange || '—'}</td>
                <td className="px-6 py-4 text-slate-300">{category.status}</td>
                <td className="px-6 py-4 text-slate-300">{category.featured ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 space-x-2">
                  <button type="button" onClick={() => handleEdit(category)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(category.id)} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500">
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

export default AdminCategories
