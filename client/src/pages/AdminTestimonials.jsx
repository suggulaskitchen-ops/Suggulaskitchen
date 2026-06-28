import { useEffect, useState } from 'react'
import { createTestimonial, deleteTestimonial, fetchTestimonials, updateTestimonial } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const initialForm = {
  customerName: '',
  location: '',
  rating: 5,
  review: '',
  imageUrl: '',
  displayOrder: 0
}

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchTestimonials()
        setTestimonials(result)
      } catch {
        setStatus({ type: 'error', message: 'Unable to load testimonials.' })
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
    const { name, value, type } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
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
      await deleteTestimonial(id)
      setTestimonials((prev) => prev.filter((item) => item.id !== id))
      setStatus({ type: 'success', message: 'Testimonial deleted successfully.' })
    } catch {
      setStatus({ type: 'error', message: 'Unable to delete testimonial.' })
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
        const updated = await updateTestimonial(form.id, form)
        setTestimonials((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        setStatus({ type: 'success', message: 'Testimonial updated successfully.' })
      } else {
        const created = await createTestimonial(form)
        setTestimonials((prev) => [created, ...prev])
        setStatus({ type: 'success', message: 'Testimonial created successfully.' })
      }
      resetForm()
    } catch {
      setStatus({ type: 'error', message: 'Unable to save testimonial.' })
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
        <h1 className="text-3xl font-semibold">Testimonial Management</h1>
        <p className="mt-2 text-slate-400">Manage customer testimonials shown on the homepage.</p>
      </div>

      {status && (
        <div className={`rounded-3xl p-4 ${status.type === 'success' ? 'bg-emerald-600/15 text-emerald-200' : 'bg-rose-600/15 text-rose-200'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Customer Name</span>
          <input name="customerName" value={form.customerName} onChange={handleChange} required className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Location</span>
          <input name="location" value={form.location} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2 xl:col-span-2">
          <span className="text-sm font-medium text-slate-200">Review</span>
          <textarea name="review" value={form.review} onChange={handleChange} rows="4" className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Rating</span>
          <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Image URL</span>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Display Order</span>
          <input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <button type="submit" disabled={saving} className="xl:col-span-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
          {editing ? 'Update Testimonial' : 'Add Testimonial'}
        </button>
      </form>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
          <thead className="bg-slate-900/90 text-slate-400">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {testimonials.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">{item.customerName}</td>
                <td className="px-6 py-4 text-slate-300">{item.location}</td>
                <td className="px-6 py-4 text-slate-300">{item.rating}</td>
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

export default AdminTestimonials
