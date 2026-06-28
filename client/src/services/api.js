import axios from 'axios'

const envBase = import.meta.env.VITE_API_BASE_URL
let baseURL = envBase?.trim() || ''

if (import.meta.env.PROD && !baseURL) {
  console.error(
    '[API] Missing VITE_API_BASE_URL in production build. API requests will use relative URLs and fail on GitHub Pages.'
  )
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
  if (!apiClient.defaults.baseURL) return fetchMock('data.json')
  const response = await apiClient.get('/data')
  return response.data
}

export async function fetchDashboardCounts() {
  if (!apiClient.defaults.baseURL) return fetchMock('counts.json')
  const response = await apiClient.get('/data/counts')
  return response.data
}

export async function fetchFullData() {
  if (!apiClient.defaults.baseURL) return fetchMock('data.json')
  const response = await apiClient.get('/data')
  return response.data
}

export async function fetchBusinessInfo() {
  if (!apiClient.defaults.baseURL) {
    const d = await fetchMock('data.json')
    return d.business
  }
  const response = await apiClient.get('/business')
  return response.data
}

export async function updateBusinessInfo(payload) {
  const response = await apiClient.put('/business', payload)
  return response.data
}

export async function fetchCategories() {
  if (!apiClient.defaults.baseURL) {
    const d = await fetchMock('data.json')
    return d.categories
  }
  const response = await apiClient.get('/categories')
  return response.data
}

export async function createCategory(payload) {
  const response = await apiClient.post('/categories', payload)
  return response.data
}

export async function updateCategory(id, payload) {
  const response = await apiClient.put(`/categories/${id}`, payload)
  return response.data
}

export async function deleteCategory(id) {
  const response = await apiClient.delete(`/categories/${id}`)
  return response.data
}

export async function fetchProducts() {
  if (!apiClient.defaults.baseURL) {
    const d = await fetchMock('data.json')
    return d.products
  }
  const response = await apiClient.get('/products')
  return response.data
}

export async function createProduct(payload) {
  const response = await apiClient.post('/products', payload)
  return response.data
}

export async function updateProduct(id, payload) {
  const response = await apiClient.put(`/products/${id}`, payload)
  return response.data
}

export async function deleteProduct(id) {
  const response = await apiClient.delete(`/products/${id}`)
  return response.data
}

export async function fetchGalleryItems() {
  if (!apiClient.defaults.baseURL) {
    const d = await fetchMock('data.json')
    return d.gallery
  }
  const response = await apiClient.get('/gallery')
  return response.data
}

export async function createGalleryItem(payload) {
  const response = await apiClient.post('/gallery', payload)
  return response.data
}

export async function updateGalleryItem(id, payload) {
  const response = await apiClient.put(`/gallery/${id}`, payload)
  return response.data
}

export async function deleteGalleryItem(id) {
  const response = await apiClient.delete(`/gallery/${id}`)
  return response.data
}

export async function fetchTestimonials() {
  if (!apiClient.defaults.baseURL) {
    const d = await fetchMock('data.json')
    return d.testimonials
  }
  const response = await apiClient.get('/testimonials')
  return response.data
}

export async function createTestimonial(payload) {
  const response = await apiClient.post('/testimonials', payload)
  return response.data
}

export async function updateTestimonial(id, payload) {
  const response = await apiClient.put(`/testimonials/${id}`, payload)
  return response.data
}

export async function deleteTestimonial(id) {
  const response = await apiClient.delete(`/testimonials/${id}`)
  return response.data
}
