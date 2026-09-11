import { useState, useEffect } from 'react'
import { Utensils } from 'lucide-react'

export default function FallbackImage({ src, alt, className = '', fallbackClassName = '' }) {
  const [hasError, setHasError] = useState(!src)

  // Reset error state if a new src is provided
  useEffect(() => {
    setHasError(!src)
  }, [src])

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 ${className} ${fallbackClassName}`}>
        <Utensils className="h-8 w-8 mb-2 opacity-50" />
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">No Image</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt || 'Image'}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}
