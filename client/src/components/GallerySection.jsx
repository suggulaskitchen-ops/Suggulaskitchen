import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import FallbackImage from './FallbackImage'

function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    const videoId = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v')
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  } catch {
    return ''
  }
}

function getInstagramEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'instagram.com' && !parsed.hostname.endsWith('.instagram.com')) return ''

    const match = parsed.pathname.match(/^\/(p|reel|tv)\/([^/]+)/i)
    return match ? `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/embed?hidecaption=true` : ''
  } catch {
    return ''
  }
}

function GalleryMedia({ item }) {
  const [imageFailed, setImageFailed] = useState(false)
  const mediaUrl = item.mediaUrl || item.media_url || item.socialUrl || item.social_url || item.imageUrl || item.image_url || item.publicUrl || item.public_url || item.url
  const normalizedUrl = String(mediaUrl || '').toLowerCase()
  const mediaType = item.mediaType || item.media_type || (
    normalizedUrl.includes('instagram.com') ? 'instagram' :
      normalizedUrl.includes('facebook.com') ? 'facebook' :
        normalizedUrl.includes('youtube.com') || normalizedUrl.includes('youtu.be') ? 'youtube' : 'image'
  )

  if (!mediaUrl) {
    return <div className="flex h-[28rem] items-center justify-center bg-slate-100 text-sm text-slate-500 sm:h-[30rem]">Image unavailable</div>
  }

  if (mediaType === 'youtube') {
    const embedUrl = getYouTubeEmbedUrl(mediaUrl)
    return embedUrl ? <iframe title={item.title} src={embedUrl} className="h-[28rem] w-full sm:h-[30rem]" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="flex h-[28rem] items-center justify-center bg-slate-100 text-sm text-slate-500 sm:h-[30rem]">Video unavailable</div>
  }

  if (mediaType === 'instagram') {
    const embedUrl = getInstagramEmbedUrl(mediaUrl)
    return embedUrl ? (
      <div className="h-[28rem] w-full overflow-hidden bg-white sm:h-[30rem]">
        <iframe title={item.title} src={embedUrl} className="h-full w-full border-0" scrolling="no" allow="autoplay; encrypted-media" allowFullScreen loading="lazy" />
      </div>
    ) : (
      <a href={mediaUrl} target="_blank" rel="noreferrer" className="flex h-64 flex-col items-center justify-center gap-3 bg-[#26351c] p-6 text-center text-white transition hover:bg-[#354a24]">
        <ExternalLink className="h-8 w-8 text-[#b8e532]" />
        <span className="text-sm font-semibold">View on Instagram</span>
      </a>
    )
  }

  if (mediaType === 'facebook') {
    return (
      <a href={mediaUrl} target="_blank" rel="noreferrer" className="flex h-[28rem] flex-col items-center justify-center gap-3 bg-[#26351c] p-6 text-center text-white transition hover:bg-[#354a24] sm:h-[30rem]">
        <ExternalLink className="h-8 w-8 text-[#b8e532]" />
        <span className="text-sm font-semibold">View on Facebook</span>
      </a>
    )
  }

  if (imageFailed) {
    return (
      <a href={mediaUrl} target="_blank" rel="noreferrer" className="flex h-[28rem] flex-col items-center justify-center gap-3 bg-slate-100 p-6 text-center text-slate-600 transition hover:bg-slate-200 sm:h-[30rem]">
        <ExternalLink className="h-8 w-8 text-emerald-600" />
        <span className="text-sm font-semibold">View {item.title}</span>
      </a>
    )
  }

  return (
    <div className="h-[28rem] w-full overflow-hidden bg-slate-100 sm:h-[30rem]">
      <FallbackImage src={mediaUrl} alt={item.title} className="block h-full w-full object-cover" fallbackClassName="h-full" />
    </div>
  )
}

function GallerySection({ items }) {
  const visibleItems = items.filter((item) => {
    const title = String(item.title || '').trim().toLowerCase()
    return item.status !== 'hidden' && (item.imageUrl || item.image_url || item.mediaUrl || item.media_url || item.socialUrl || item.social_url || item.publicUrl || item.public_url || item.url) && title
  })

  return (
    <section id="gallery" className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-7">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Gallery</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Made with care</h2>
      </div>
      {visibleItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
