import { useEffect, useState } from 'react'
import { createProduct, deleteProduct, fetchCategories, fetchProducts, updateProduct, uploadImage } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ImagePicker from '../components/ImagePicker'
import StatusBanner from '../components/StatusBanner'

const initialForm = {
  name: '',
  category: '',
  categories_id: null,
  shortDescription: '',
  actualPrice: '',
  currentPrice: '',
  availability: 'available',
  featured: false,
  bestSeller: false,
  newArrival: false,
  veg: true,
  preparationTime: '',
  ingredients: '',
  spiceLevel: '',
  imageUrl: '',
  image_id: null
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

  const handleCategoryChange = (event) => {
    const category = categories.find((item) => item.name === event.target.value)
    setForm((prev) => ({
      ...prev,
      category: event.target.value,
      categories_id: category?.id || null
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
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      <div className="flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Product Management</h1>
          <p className="mt-2 text-sm text-slate-400">Create and update products shown in the customer menu.</p>
        </div>
        <span className="hidden rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 sm:inline-block">{location.pathname}</span>
      </div>

      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Product Name</span>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Category</span>
            <select name="category" value={form.category} onChange={handleCategoryChange} required className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}{category.priceRange ? ` (${category.priceRange})` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-sm font-medium text-slate-300">Short Description</span>
            <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows="3" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Actual Price</span>
            <input name="actualPrice" type="number" value={form.actualPrice} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Current Price</span>
            <input name="currentPrice" type="number" value={form.currentPrice} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <div className="xl:col-span-2">
            <ImagePicker value={form.imageUrl} onChange={handleChange} onUpload={uploadImage} />
          </div>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Ingredients</span>
            <input name="ingredients" value={form.ingredients} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Preparation Time</span>
            <input name="preparationTime" type="number" value={form.preparationTime} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Spice Level</span>
            <input name="spiceLevel" value={form.spiceLevel} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Availability</span>
            <select name="availability" value={form.availability} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-white/5 bg-slate-800/20 p-4">
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

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
            {editing ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
        <table className="w-full min-w-[760px] text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 bg-slate-800/50 text-xs font-medium uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Actual Price</th>
              <th className="px-6 py-4">Current Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-slate-800/30">
                <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                <td className="px-6 py-4 text-slate-400">{product.category}</td>
                <td className="px-6 py-4 text-slate-400">₹{product.actualPrice}</td>
                <td className="px-6 py-4 text-slate-400">₹{product.currentPrice}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${product.availability === 'available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                    {product.availability}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => handleEdit(product)} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">Edit</button>
                    <button type="button" onClick={() => handleDelete(product.id)} className="text-sm font-medium text-rose-400 hover:text-rose-300">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProducts
