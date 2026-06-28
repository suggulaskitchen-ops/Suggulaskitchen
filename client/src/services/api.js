import axios from 'axios'
import seedDatabase from '../../../data/database.json'

const envBase = import.meta.env.VITE_API_BASE_URL
let baseURL = envBase?.trim() || ''

const fallbackStorageKey = 'my-first-website-fallback-data'

function normalizeFallbackData(source = seedDatabase) {
  const businessInfo = source?.businessInfo || source?.business || {}
  const categories = Array.isArray(source?.categories) ? source.categories : []
  const products = Array.isArray(source?.products) ? source.products : []
  const gallery = Array.isArray(source?.gallery) ? source.gallery : []
  const testimonials = Array.isArray(source?.testimonials) ? source.testimonials : []

  return {
    businessInfo,
    categories,
    products,
    gallery,
    testimonials,
    socialLinks: Array.isArray(businessInfo.socialLinks) ? businessInfo.socialLinks : [],
    counts: {
      categories: categories.length,
      products: products.length
    }
  }
}

const fallbackSeedSnapshot = normalizeFallbackData(seedDatabase)

async function readFallbackData() {
  if (typeof window === 'undefined') {
    return fallbackSeedSnapshot
  }

  try {
    const stored = window.localStorage.getItem(fallbackStorageKey)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && typeof parsed === 'object') {
        return normalizeFallbackData(parsed)
      }
    }
  } catch {
    // Ignore malformed stored data and fall back to the bundled seed data.
  }

  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(fallbackSeedSnapshot))
  return fallbackSeedSnapshot
}

async function writeFallbackData(nextData) {
  const normalized = normalizeFallbackData(nextData)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(fallbackStorageKey, JSON.stringify(normalized))
  }

  return normalized
}

async function getFallbackCollection(collectionKey) {
  const data = await readFallbackData()
  return data?.[collectionKey] || []
}

async function createFallbackCollectionItem(collectionKey, payload) {
  const data = await readFallbackData()
  const item = { id: payload.id || `local-${Date.now()}`, ...payload }
  const items = [item, ...(data?.[collectionKey] || [])]
  await writeFallbackData({ ...(data || {}), [collectionKey]: items })
  return item
}

async function updateFallbackCollectionItem(collectionKey, id, payload) {
  const data = await readFallbackData()
  const items = [...(data?.[collectionKey] || [])]
  const index = items.findIndex((item) => String(item.id) === String(id))

  if (index >= 0) {
    items[index] = { ...items[index], ...payload }
  } else {
    items.unshift({ id, ...payload })
  }

  await writeFallbackData({ ...(data || {}), [collectionKey]: items })
  return items[index >= 0 ? index : 0]
}

async function deleteFallbackCollectionItem(collectionKey, id) {
  const data = await readFallbackData()
  const items = (data?.[collectionKey] || []).filter((item) => String(item.id) !== String(id))
  await writeFallbackData({ ...(data || {}), [collectionKey]: items })
  return { success: true }
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

export async function fetchAppData() {
  if (!hasConfiguredBackend()) {
    return readFallbackData()
  }
  const response = await apiClient.get('/data')
  return response.data
}

export async function fetchDashboardCounts() {
  if (!hasConfiguredBackend()) {
    const data = await readFallbackData()
    return data.counts || { categories: 0, products: 0 }
  }
  const response = await apiClient.get('/data/counts')
  return response.data
}

export async function fetchFullData() {
  if (!hasConfiguredBackend()) {
    return readFallbackData()
  }
  const response = await apiClient.get('/data')
  return response.data
}

export async function fetchBusinessInfo() {
  if (!hasConfiguredBackend()) {
    const data = await readFallbackData()
    return data?.businessInfo || {}
  }
  const response = await apiClient.get('/business')
  return response.data
}

export async function updateBusinessInfo(payload) {
  if (!hasConfiguredBackend()) {
    const data = await readFallbackData()
    const businessInfo = { ...(data?.businessInfo || {}), ...payload }
    await writeFallbackData({ ...(data || {}), businessInfo })
    return businessInfo
  }
  const response = await apiClient.put('/business', payload)
  return response.data
}

export async function fetchCategories() {
  if (!hasConfiguredBackend()) {
    return getFallbackCollection('categories')
  }
  const response = await apiClient.get('/categories')
  return response.data
}

export async function createCategory(payload) {
  if (!hasConfiguredBackend()) {
    return createFallbackCollectionItem('categories', payload)
  }
  const response = await apiClient.post('/categories', payload)
  return response.data
}

export async function updateCategory(id, payload) {
  if (!hasConfiguredBackend()) {
    return updateFallbackCollectionItem('categories', id, payload)
  }
  const response = await apiClient.put(`/categories/${id}`, payload)
  return response.data
}

export async function deleteCategory(id) {
  if (!hasConfiguredBackend()) {
    return deleteFallbackCollectionItem('categories', id)
  }
  const response = await apiClient.delete(`/categories/${id}`)
  return response.data
}

export async function fetchProducts() {
  if (!hasConfiguredBackend()) {
    return getFallbackCollection('products')
  }
  const response = await apiClient.get('/products')
  return response.data
}

export async function createProduct(payload) {
  if (!hasConfiguredBackend()) {
    return createFallbackCollectionItem('products', payload)
  }
  const response = await apiClient.post('/products', payload)
  return response.data
}

export async function updateProduct(id, payload) {
  if (!hasConfiguredBackend()) {
    return updateFallbackCollectionItem('products', id, payload)
  }
  const response = await apiClient.put(`/products/${id}`, payload)
  return response.data
}

export async function deleteProduct(id) {
  if (!hasConfiguredBackend()) {
    return deleteFallbackCollectionItem('products', id)
  }
  const response = await apiClient.delete(`/products/${id}`)
  return response.data
}

export async function fetchGalleryItems() {
  if (!hasConfiguredBackend()) {
    return getFallbackCollection('gallery')
  }
  const response = await apiClient.get('/gallery')
  return response.data
}

export async function createGalleryItem(payload) {
  if (!hasConfiguredBackend()) {
    return createFallbackCollectionItem('gallery', payload)
  }
  const response = await apiClient.post('/gallery', payload)
  return response.data
}

export async function updateGalleryItem(id, payload) {
  if (!hasConfiguredBackend()) {
    return updateFallbackCollectionItem('gallery', id, payload)
  }
  const response = await apiClient.put(`/gallery/${id}`, payload)
  return response.data
}

export async function deleteGalleryItem(id) {
  if (!hasConfiguredBackend()) {
    return deleteFallbackCollectionItem('gallery', id)
  }
  const response = await apiClient.delete(`/gallery/${id}`)
  return response.data
}

export async function fetchTestimonials() {
  if (!hasConfiguredBackend()) {
    return getFallbackCollection('testimonials')
  }
  const response = await apiClient.get('/testimonials')
  return response.data
}

export async function createTestimonial(payload) {
  if (!hasConfiguredBackend()) {
    return createFallbackCollectionItem('testimonials', payload)
  }
  const response = await apiClient.post('/testimonials', payload)
  return response.data
}

export async function updateTestimonial(id, payload) {
  if (!hasConfiguredBackend()) {
    return updateFallbackCollectionItem('testimonials', id, payload)
  }
  const response = await apiClient.put(`/testimonials/${id}`, payload)
  return response.data
}

export async function deleteTestimonial(id) {
  if (!hasConfiguredBackend()) {
    return deleteFallbackCollectionItem('testimonials', id)
  }
  const response = await apiClient.delete(`/testimonials/${id}`)
  return response.data
}
