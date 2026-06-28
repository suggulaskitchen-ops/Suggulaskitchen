import { useEffect, useState } from 'react'
import { createProduct, deleteProduct, fetchCategories, fetchProducts, updateProduct } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ImagePicker from '../components/ImagePicker'

const initialForm = {
  name: '',
  category: '',
  shortDescription: '',
  price: '',
  availability: 'available',
  featured: false,
  bestSeller: false,
  newArrival: false,
  veg: true,
  preparationTime: '',
  ingredients: '',
  spiceLevel: '',
  imageUrl: ''
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [productsResult, categoriesResult] = await Promise.all([fetchProducts(), fetchCategories()])
        setProducts(productsResult)
        setCategories(categoriesResult)
      } catch {
        setStatus({ type: 'error', message: 'Unable to load products or categories.' })
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

  const handleEdit = (product) => {
    setForm(product)
    setEditing(true)
    setStatus(null)
  }

  const handleDelete = async (id) => {
    setSaving(true)
    setStatus(null)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((item) => item.id !== id))
      setStatus({ type: 'success', message: 'Product deleted successfully.' })
    } catch {
      setStatus({ type: 'error', message: 'Unable to delete product.' })
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
        const updated = await updateProduct(form.id, form)
        setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        setStatus({ type: 'success', message: 'Product updated successfully.' })
      } else {
        const created = await createProduct(form)
        setProducts((prev) => [created, ...prev])
        setStatus({ type: 'success', message: 'Product created successfully.' })
      }
      resetForm()
    } catch {
      setStatus({ type: 'error', message: 'Unable to save product.' })
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
        <h1 className="text-3xl font-semibold">Product Management</h1>
        <p className="mt-2 text-slate-400">Create and update products shown in the customer menu.</p>
      </div>

      {status && (
        <div className={`rounded-3xl p-4 ${status.type === 'success' ? 'bg-emerald-600/15 text-emerald-200' : 'bg-rose-600/15 text-rose-200'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Product Name</span>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Category</span>
          <select name="category" value={form.category} onChange={handleChange} required className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500">
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}{category.priceRange ? ` (${category.priceRange})` : ''}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 xl:col-span-2">
          <span className="text-sm font-medium text-slate-200">Short Description</span>
          <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows="3" className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Price</span>
          <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <div className="xl:col-span-2">
          <ImagePicker value={form.imageUrl} onChange={handleChange} />
        </div>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Ingredients</span>
          <input name="ingredients" value={form.ingredients} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Preparation Time</span>
          <input name="preparationTime" type="number" value={form.preparationTime} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Spice Level</span>
          <input name="spiceLevel" value={form.spiceLevel} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500" />
        </label>
        <div className="grid gap-4 xl:grid-cols-2">
          <label className="flex items-center gap-3">
            <input name="veg" type="checkbox" checked={form.veg} onChange={(event) => setForm((prev) => ({ ...prev, veg: event.target.checked }))} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm text-slate-300">Veg</span>
          </label>
          <label className="flex items-center gap-3">
            <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm text-slate-300">Featured</span>
          </label>
          <label className="flex items-center gap-3">
            <input name="bestSeller" type="checkbox" checked={form.bestSeller} onChange={handleChange} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm text-slate-300">Best Seller</span>
          </label>
          <label className="flex items-center gap-3">
            <input name="newArrival" type="checkbox" checked={form.newArrival} onChange={handleChange} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm text-slate-300">New Arrival</span>
          </label>
        </div>
        <label className="xl:col-span-2 space-y-2">
          <span className="text-sm font-medium text-slate-200">Availability</span>
          <select name="availability" value={form.availability} onChange={handleChange} className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500">
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </label>
        <button type="submit" disabled={saving} className="xl:col-span-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
          {editing ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
          <thead className="bg-slate-900/90 text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4 text-slate-300">{product.category}</td>
                <td className="px-6 py-4 text-slate-300">₹{product.price}</td>
                <td className="px-6 py-4 text-slate-300">{product.availability}</td>
                <td className="px-6 py-4 space-x-2">
                  <button type="button" onClick={() => handleEdit(product)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(product.id)} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500">
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

export default AdminProducts
