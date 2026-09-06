import { ExternalLink } from 'lucide-react'

function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    const videoId = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v')
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  } catch {
    return ''
  }
}

function GalleryMedia({ item }) {
  const mediaType = item.mediaType || 'image'
  const mediaUrl = item.mediaUrl || item.imageUrl

  if (mediaType === 'youtube') {
    const embedUrl = getYouTubeEmbedUrl(mediaUrl)
    return embedUrl ? <iframe title={item.title} src={embedUrl} className="aspect-video w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : null
  }

  if (mediaType === 'instagram' || mediaType === 'facebook') {
    return (
      <a href={mediaUrl} target="_blank" rel="noreferrer" className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-[#26351c] p-6 text-center text-white transition hover:bg-[#354a24]">
        <ExternalLink className="h-8 w-8 text-[#b8e532]" />
        <span className="text-sm font-semibold">View on {mediaType === 'instagram' ? 'Instagram' : 'Facebook'}</span>
      </a>
    )
  }

  return <img src={mediaUrl} alt={item.title} className="aspect-[4/3] w-full object-cover" />
}

function GallerySection({ items }) {
  const visibleItems = items.filter((item) => {
    const title = String(item.title || '').trim().toLowerCase()
    return item.status !== 'hidden' && (item.imageUrl || item.mediaUrl) && title && !['test', 'rrt'].includes(title)
  })

  return (
    <section id="gallery" className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-7">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Gallery</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Made with care</h2>
      </div>
      {visibleItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <GalleryMedia item={item} />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">Gallery items will appear here soon.</p>
      )}
    </section>
  )
}

export default GallerySection
