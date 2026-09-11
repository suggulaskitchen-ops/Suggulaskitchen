import { useState } from 'react'

function ImagePicker({ name = 'imageUrl', value, onChange, onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !onUpload) return

    setUploading(true)
    setUploadError('')
    try {
      const url = await onUpload(file)
      onChange({ target: { name, value: url } })
    } catch (error) {
      setUploadError(error?.message || 'Image upload failed. Check the gallery bucket and Storage policies.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Upload image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || !onUpload}
          className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:font-medium file:text-white"
        />
      </label>
      {uploading && <p className="text-xs text-emerald-300">Uploading...</p>}
      {uploadError && <p className="text-xs text-rose-300">{uploadError}</p>}
      {value && !uploading && <p className="truncate text-xs text-slate-400">Image uploaded successfully.</p>}
    </div>
  )
}

export default ImagePicker
