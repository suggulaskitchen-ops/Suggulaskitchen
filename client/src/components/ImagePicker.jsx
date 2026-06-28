import { useEffect, useState } from 'react'
import { uploadImage } from '../services/upload'

function ImagePicker({ value, onChange }) {
  const placeholder = import.meta.env.BASE_URL + 'images/placeholder.svg'
  const [preview, setPreview] = useState(value || placeholder)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setPreview(value || placeholder)
  }, [value])

  const handleUrlChange = (event) => {
    setPreview(event.target.value || placeholder)
    onChange(event)
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const data = await uploadImage(file)
      setPreview(data.url)
      onChange({ target: { name: 'imageUrl', value: data.url } })
    } catch (uploadError) {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Image URL</span>
          <input
            type="text"
            name="imageUrl"
            value={value || ''}
            onChange={handleUrlChange}
            placeholder="Paste a local or remote image URL"
            className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Upload local image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition file:cursor-pointer file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </label>
      </div>

      {uploading && <p className="text-sm text-emerald-400">Uploading image…</p>}
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  )
}

export default ImagePicker
