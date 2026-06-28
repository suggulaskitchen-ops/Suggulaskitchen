import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export async function fetchAppData() {
  const response = await apiClient.get('/data')
  return response.data
}

export async function fetchDashboardCounts() {
  const response = await apiClient.get('/data/counts')
  return response.data
}

export async function fetchFullData() {
  const response = await apiClient.get('/data')
  return response.data
}

export async function fetchBusinessInfo() {
  const response = await apiClient.get('/business')
  return response.data
}

export async function updateBusinessInfo(payload) {
  const response = await apiClient.put('/business', payload)
  return response.data
}

export async function fetchCategories() {
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
