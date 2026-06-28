import axios from 'axios'

const envBase = import.meta.env.VITE_API_BASE_URL
let baseURL = envBase?.trim() || ''

const fallbackStorageKey = 'my-first-website-fallback-data'

async function fetchFallbackData() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = window.localStorage.getItem(fallbackStorageKey)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore malformed stored data and fall back to the bundled mock data.
  }

  const fallback = await fetchMock('data.json')
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(fallbackStorageKey, JSON.stringify(fallback))
  }

  return fallback
}

async function persistFallbackData(nextData) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(fallbackStorageKey, JSON.stringify(nextData))
  }
  return nextData
}

function hasConfiguredBackend() {
  return Boolean(apiClient.defaults.baseURL)
}

// Only use the local backend during development (don't bake into production builds).
// Vite sets `import.meta.env.DEV` to true when running in dev mode.
if (!baseURL && typeof window !== 'undefined' && import.meta.env.DEV && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  baseURL = 'http://localhost:4000/api'
}

export const apiClient = axios.create({
  baseURL: baseURL || undefined,
  headers: {
    'Content-Type': 'application/json'
  }
})

const mockBase = import.meta.env.BASE_URL + 'mock/'

async function fetchMock(path) {
  const url = mockBase + path
  const res = await fetch(url)
  if (!res.ok) throw new Error('Mock data not found: ' + url)
  return res.json()
}

export async function fetchAppData() {
  if (!hasConfiguredBackend()) {
    return fetchFallbackData()
  }
  const response = await apiClient.get('/data')
  return response.data
}

export async function fetchDashboardCounts() {
  if (!hasConfiguredBackend()) return fetchMock('counts.json')
  const response = await apiClient.get('/data/counts')
  return response.data
}

export async function fetchFullData() {
  if (!hasConfiguredBackend()) {
    return fetchFallbackData()
  }
  const response = await apiClient.get('/data')
  return response.data
}

export async function fetchBusinessInfo() {
  if (!hasConfiguredBackend()) {
    const d = await fetchFallbackData()
    return d?.business || {}
  }
  const response = await apiClient.get('/business')
  return response.data
}

export async function updateBusinessInfo(payload) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const business = { ...(data?.business || {}), ...payload }
    const nextData = { ...(data || {}), business }
    await persistFallbackData(nextData)
    return business
  }
  const response = await apiClient.put('/business', payload)
  return response.data
}

export async function fetchCategories() {
  if (!hasConfiguredBackend()) {
    const d = await fetchFallbackData()
    return d?.categories || []
  }
  const response = await apiClient.get('/categories')
  return response.data
}

export async function createCategory(payload) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const category = { id: payload.id || `local-${Date.now()}`, ...payload }
    const categories = [category, ...(data?.categories || [])]
    await persistFallbackData({ ...(data || {}), categories })
    return category
  }
  const response = await apiClient.post('/categories', payload)
  return response.data
}

export async function updateCategory(id, payload) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const categories = [...(data?.categories || [])]
    const index = categories.findIndex((item) => String(item.id) === String(id))

    if (index >= 0) {
      categories[index] = { ...categories[index], ...payload }
    } else {
      categories.unshift({ id, ...payload })
    }

    await persistFallbackData({ ...(data || {}), categories })
    return categories[index >= 0 ? index : 0]
  }
  const response = await apiClient.put(`/categories/${id}`, payload)
  return response.data
}

export async function deleteCategory(id) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const categories = (data?.categories || []).filter((item) => String(item.id) !== String(id))
    await persistFallbackData({ ...(data || {}), categories })
    return { success: true }
  }
  const response = await apiClient.delete(`/categories/${id}`)
  return response.data
}

export async function fetchProducts() {
  if (!hasConfiguredBackend()) {
    const d = await fetchFallbackData()
    return d?.products || []
  }
  const response = await apiClient.get('/products')
  return response.data
}

export async function createProduct(payload) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const product = { id: payload.id || `local-${Date.now()}`, ...payload }
    const products = [product, ...(data?.products || [])]
    await persistFallbackData({ ...(data || {}), products })
    return product
  }
  const response = await apiClient.post('/products', payload)
  return response.data
}

export async function updateProduct(id, payload) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const products = [...(data?.products || [])]
    const index = products.findIndex((item) => String(item.id) === String(id))

    if (index >= 0) {
      products[index] = { ...products[index], ...payload }
    } else {
      products.unshift({ id, ...payload })
    }

    await persistFallbackData({ ...(data || {}), products })
    return products[index >= 0 ? index : 0]
  }
  const response = await apiClient.put(`/products/${id}`, payload)
  return response.data
}

export async function deleteProduct(id) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const products = (data?.products || []).filter((item) => String(item.id) !== String(id))
    await persistFallbackData({ ...(data || {}), products })
    return { success: true }
  }
  const response = await apiClient.delete(`/products/${id}`)
  return response.data
}

export async function fetchGalleryItems() {
  if (!hasConfiguredBackend()) {
    const d = await fetchFallbackData()
    return d?.gallery || []
  }
  const response = await apiClient.get('/gallery')
  return response.data
}

export async function createGalleryItem(payload) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const gallery = [{ id: payload.id || `local-${Date.now()}`, ...payload }, ...(data?.gallery || [])]
    await persistFallbackData({ ...(data || {}), gallery })
    return gallery[0]
  }
  const response = await apiClient.post('/gallery', payload)
  return response.data
}

export async function updateGalleryItem(id, payload) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const gallery = [...(data?.gallery || [])]
    const index = gallery.findIndex((item) => String(item.id) === String(id))

    if (index >= 0) {
      gallery[index] = { ...gallery[index], ...payload }
    } else {
      gallery.unshift({ id, ...payload })
    }

    await persistFallbackData({ ...(data || {}), gallery })
    return gallery[index >= 0 ? index : 0]
  }
  const response = await apiClient.put(`/gallery/${id}`, payload)
  return response.data
}

export async function deleteGalleryItem(id) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const gallery = (data?.gallery || []).filter((item) => String(item.id) !== String(id))
    await persistFallbackData({ ...(data || {}), gallery })
    return { success: true }
  }
  const response = await apiClient.delete(`/gallery/${id}`)
  return response.data
}

export async function fetchTestimonials() {
  if (!hasConfiguredBackend()) {
    const d = await fetchFallbackData()
    return d?.testimonials || []
  }
  const response = await apiClient.get('/testimonials')
  return response.data
}

export async function createTestimonial(payload) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const testimonial = { id: payload.id || `local-${Date.now()}`, ...payload }
    const testimonials = [testimonial, ...(data?.testimonials || [])]
    await persistFallbackData({ ...(data || {}), testimonials })
    return testimonial
  }
  const response = await apiClient.post('/testimonials', payload)
  return response.data
}

export async function updateTestimonial(id, payload) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const testimonials = [...(data?.testimonials || [])]
    const index = testimonials.findIndex((item) => String(item.id) === String(id))

    if (index >= 0) {
      testimonials[index] = { ...testimonials[index], ...payload }
    } else {
      testimonials.unshift({ id, ...payload })
    }

    await persistFallbackData({ ...(data || {}), testimonials })
    return testimonials[index >= 0 ? index : 0]
  }
  const response = await apiClient.put(`/testimonials/${id}`, payload)
  return response.data
}

export async function deleteTestimonial(id) {
  if (!hasConfiguredBackend()) {
    const data = await fetchFallbackData()
    const testimonials = (data?.testimonials || []).filter((item) => String(item.id) !== String(id))
    await persistFallbackData({ ...(data || {}), testimonials })
    return { success: true }
  }
  const response = await apiClient.delete(`/testimonials/${id}`)
  return response.data
}
