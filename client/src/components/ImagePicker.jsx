import { useEffect, useMemo, useState } from 'react'

const imageAssetEntries = import.meta.glob('/public/images/*', { eager: true, import: 'default' })

function ImagePicker({ value, onChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const availableImages = useMemo(() => {
    return Object.entries(imageAssetEntries)
      .map(([path]) => {
        const fileName = path.split('/').pop() || ''
        const publicUrl = `${import.meta.env.BASE_URL}images/${fileName}`
        return { name: fileName, url: publicUrl }
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const filteredImages = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase()
    if (!needle) return availableImages
    return availableImages.filter((image) => image.name.toLowerCase().includes(needle))
  }, [availableImages, searchTerm])

  useEffect(() => {
    const currentFileName = value?.split('/').filter(Boolean).pop() || ''
    setSearchTerm(currentFileName)
  }, [value])

  const handleUrlChange = (event) => {
    onChange(event)
  }

  const selectImage = (image) => {
    setSearchTerm(image.name)
    setIsOpen(false)
    onChange({ target: { name: 'imageUrl', value: image.url } })
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
          <span className="text-sm font-medium text-slate-200">Choose existing image</span>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
              placeholder="Search image file name"
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
            />
            {isOpen && filteredImages.length > 0 && (
              <div className="absolute z-20 mt-2 max-h-48 w-full overflow-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
                {filteredImages.map((image) => (
                  <button
                    key={image.name}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectImage(image)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                  >
                    <span>{image.name}</span>
                    <span className="text-xs text-slate-400">Select</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </label>
      </div>

    </div>
  )
}

export default ImagePicker
