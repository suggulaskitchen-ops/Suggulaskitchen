import { supabase } from './supabaseClient'

const toArray = (value) => (Array.isArray(value) ? value : [])

const imageUrlFromGallery = (gallery) => gallery?.imageUrl || gallery?.image_url || gallery?.publicUrl || gallery?.public_url || gallery?.url || gallery?.photo_url || ''
const galleryImageFor = (galleryById, imageId) => imageUrlFromGallery(galleryById.get(imageId) || galleryById.get(String(imageId)))

function storagePathFromUrl(imageUrl) {
  if (!imageUrl) return ''

  try {
    const parsed = new URL(imageUrl, window.location.origin)
    const markers = ['/storage/v1/object/public/gallery/', '/storage/v1/object/sign/gallery/']
    const marker = markers.find((candidate) => parsed.pathname.includes(candidate))
    return marker ? decodeURIComponent(parsed.pathname.split(marker)[1]) : ''
  } catch {
    return ''
  }
}

function storageUrlForPersistence(imageUrl) {
  const storagePath = storagePathFromUrl(imageUrl)
  if (!storagePath) return imageUrl || ''

  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery/${storagePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')}`
}

async function resolveGalleryImageUrl(imageUrl) {
  const storagePath = storagePathFromUrl(imageUrl)
  if (!storagePath) return imageUrl || ''

  const { data } = supabase.storage
    .from('gallery')
    .getPublicUrl(storagePath)

  return data.publicUrl || ''
}

const normalizeGallery = async (item) => ({
  ...item,
  imageUrl: await resolveGalleryImageUrl(imageUrlFromGallery(item)),
  mediaUrl: item.mediaUrl || item.media_url || item.socialUrl || item.social_url || item.url || '',
  mediaType: item.mediaType || item.media_type || ''
})

const normalizeCategory = (item, galleryById) => ({
  ...item,
  imageUrl: galleryImageFor(galleryById, item.image_id ?? item.imageId) || item.imageUrl || item.image_url || '',
  priceRange: item.priceRange ?? item.price_range ?? '',
  featured: Boolean(item.featured)
})

const normalizeProduct = (item, galleryById) => ({
  ...item,
  actualPrice: Number(item.actual_price ?? item.price ?? 0),
  currentPrice: Number(item.current_price ?? item.price ?? 0),
  price: Number(item.current_price ?? item.price ?? 0),
  offerPrice: item.actual_price && item.current_price && Number(item.actual_price) > Number(item.current_price)
    ? Number(item.actual_price)
    : null,
  imageUrl: galleryImageFor(galleryById, item.image_id ?? item.imageId) || item.imageUrl || item.image_url || ''
})

async function resolveGalleryId(imageUrl) {
  if (!imageUrl) return null

  const persistedUrl = storageUrlForPersistence(imageUrl)

  const { data: imageUrlMatch, error: imageUrlError } = await supabase
    .from('gallery')
    .select('id')
    .eq('imageUrl', persistedUrl)
    .maybeSingle()

  if (imageUrlError) throw imageUrlError
  if (imageUrlMatch) return imageUrlMatch.id

  const { data: imageUrlSnakeMatch, error: imageUrlSnakeError } = await supabase
    .from('gallery')
    .select('id')
    .eq('image_url', persistedUrl)
    .maybeSingle()

  if (imageUrlSnakeError) throw imageUrlSnakeError
  return imageUrlSnakeMatch?.id ?? null
}

const categoryPayload = async (payload) => ({
  name: payload.name,
  image_id: payload.imageUrl ? await resolveGalleryId(payload.imageUrl) : payload.image_id,
  description: payload.description || null,
  priceRange: payload.priceRange || null,
  status: payload.status || 'active',
  featured: Boolean(payload.featured)
})

const productPayload = async (payload) => ({
  name: payload.name,
  category: payload.category,
  shortDescription: payload.shortDescription || null,
  price: Number(payload.currentPrice ?? payload.price),
  actual_price: Number(payload.actualPrice ?? payload.price),
  current_price: Number(payload.currentPrice ?? payload.price),
  availability: payload.availability || 'available',
  featured: Boolean(payload.featured),
  bestSeller: Boolean(payload.bestSeller),
  newArrival: Boolean(payload.newArrival),
  veg: Boolean(payload.veg),
  preparationTime: payload.preparationTime ? Number(payload.preparationTime) : null,
  ingredients: payload.ingredients || null,
  spiceLevel: payload.spiceLevel || null,
  image_id: payload.imageUrl ? await resolveGalleryId(payload.imageUrl) : payload.image_id,
  categories_id: payload.categories_id || null
})

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file and restart the dev server.')
  }
}

export async function uploadImage(file) {
  ensureSupabase()
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from('gallery')
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type || 'application/octet-stream',
      upsert: false
    })

  if (error) throw error
  const { data } = supabase.storage.from('gallery').getPublicUrl(filePath)
  return data.publicUrl
}



export async function getOrCreateCustomer({ name, phone, address }) {
  ensureSupabase()
  const { data: existing, error: findError } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .maybeSingle()

  if (findError) throw findError
  if (existing) return existing

  const { data: created, error: insertError } = await supabase
    .from('customers')
    .insert([{ name, phone, address }])
    .select()
    .single()

  if (insertError) throw insertError
  return created
}

export async function placeOrder({ customerId, items, total }) {
  ensureSupabase()
  const { data, error } = await supabase
    .from('orders')
    .insert([{ customer_id: customerId, items, total, status: 'pending' }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function submitOrder({ name, phone, address, cartItems, total }) {
  const customer = await getOrCreateCustomer({ name, phone, address })
  const order = await placeOrder({
    customerId: customer.id,
    items: cartItems,
    total,
  })
  return order
}

export async function fetchAppData() {
  const [businessInfo, categories, products, gallery] = await Promise.all([
    fetchBusinessInfo(),
    fetchCategories(),
    fetchProducts(),
    fetchGalleryItems()
  ])

  return {
    businessInfo,
    categories,
    products,
    gallery,
    testimonials: [],
    socialLinks: toArray(businessInfo?.socialLinks),
    counts: {
      categories: categories.length,
      products: products.length,
      gallery: gallery.length,
      testimonials: 0
    }
  }
}

export async function fetchDashboardCounts() {
  const data = await fetchAppData()
  return data.counts || { categories: 0, products: 0 }
}

export async function fetchBusinessInfo() {
  ensureSupabase()
  const { data, error } = await supabase.from('business').select('*').order('id', { ascending: true }).limit(1).maybeSingle()
  if (error?.code === 'PGRST205') return {}
  if (error) throw error
  return data
    ? {
        ...data,
        aboutTitle: data.aboutTitle ?? data.about_title,
        footerText: data.footerText ?? data.footer_text,
        socialLinks: data.socialLinks ?? data.social_links
      }
    : {}
}

export async function updateBusinessInfo(payload) {
  ensureSupabase()
  const values = {
    name: payload.name || null,
    tagline: payload.tagline || null,
    description: payload.description || null,
    aboutTitle: payload.aboutTitle || null,
    about: payload.about || null,
    mission: payload.mission || null,
    vision: payload.vision || null,
    phone: payload.phone || null,
    whatsapp: payload.whatsapp || null,
    email: payload.email || null,
    address: payload.address || null,
    hours: payload.hours || null,
    footerText: payload.footerText || null,
    socialLinks: toArray(payload.socialLinks)
  }
  const existing = await fetchBusinessInfo()
  const query = existing.id
    ? supabase.from('business').update(values).eq('id', existing.id)
    : supabase.from('business').insert([values])
  const { data, error } = await query.select().single()
  if (error) throw error
  return data
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false })
  if (error) throw error
  const gallery = await fetchGalleryItems()
  const galleryById = new Map(gallery.flatMap((item) => [[item.id, item], [String(item.id), item]]))
  return (data ?? []).map((item) => normalizeCategory(item, galleryById))
}

export async function createCategory(payload) {
  const values = await categoryPayload(payload)
  const { data, error } = await supabase
    .from('categories')
    .insert([values])
    .select()
    .single()

  if (error) throw error
  return { ...normalizeCategory(data, new Map()), imageUrl: payload.imageUrl || '' }
}

export async function updateCategory(id, payload) {
  const values = await categoryPayload(payload)
  const { data, error } = await supabase
    .from('categories')
    .update(values)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return { ...normalizeCategory(data, new Map()), imageUrl: payload.imageUrl || '' }
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
  return { success: true }
}

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  if (error) throw error
  const gallery = await fetchGalleryItems()
  const galleryById = new Map(gallery.flatMap((item) => [[item.id, item], [String(item.id), item]]))
  return (data ?? []).map((item) => normalizeProduct(item, galleryById))
}

export async function createProduct(payload) {
  const values = await productPayload(payload)
  const { data, error } = await supabase
    .from('products')
    .insert([values])
    .select()
    .single()

  if (error) throw error
  return { ...normalizeProduct(data, new Map()), imageUrl: payload.imageUrl || '' }
}

export async function updateProduct(id, payload) {
  const values = await productPayload(payload)
  const { data, error } = await supabase
    .from('products')
    .update(values)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return { ...normalizeProduct(data, new Map()), imageUrl: payload.imageUrl || '' }
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
  return { success: true }
}

export async function fetchGalleryItems() {
  const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return Promise.all((data ?? []).map(normalizeGallery))
}

export async function createGalleryItem(payload) {
  const values = {
    title: payload.title,
    image_url: storageUrlForPersistence(payload.imageUrl) || null,
    media_type: payload.mediaType || 'image',
    media_url: payload.mediaUrl || null,
    description: payload.description || null,
    status: payload.status || 'active'
  }
  const { data, error } = await supabase
    .from('gallery')
    .insert([values])
    .select()
    .single()

  if (error) throw error
  return normalizeGallery(data)
}

export async function updateGalleryItem(id, payload) {
  const values = {
    title: payload.title,
    image_url: storageUrlForPersistence(payload.imageUrl) || null,
    media_type: payload.mediaType || 'image',
    media_url: payload.mediaUrl || null,
    description: payload.description || null,
    status: payload.status || 'active'
  }
  const { data, error } = await supabase
    .from('gallery')
    .update(values)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return normalizeGallery(data)
}

async function removeGalleryStorageFile(imageUrl) {
  if (!imageUrl) return

  const storagePath = storagePathFromUrl(imageUrl)
  if (!storagePath) return

  const { error } = await supabase.storage.from('gallery').remove([storagePath])
  if (error) throw error
}

export async function deleteGalleryItem(id) {
  const { data: galleryItem, error: fetchError } = await supabase
    .from('gallery')
    .select('imageUrl, image_url')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) throw fetchError
  await removeGalleryStorageFile(imageUrlFromGallery(galleryItem))

  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw error
  return { success: true }
}

export async function fetchTestimonials() {
  return []
}

export async function createTestimonial(payload) {
  throw new Error('Testimonials require a public.testimonials table.')
}

export async function updateTestimonial(id, payload) {
  throw new Error('Testimonials require a public.testimonials table.')
}

export async function deleteTestimonial(id) {
  throw new Error('Testimonials require a public.testimonials table.')
}
