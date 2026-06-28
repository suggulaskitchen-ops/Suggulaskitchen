import { apiClient } from './api'

export async function uploadImage(file) {
  try {
    const formData = new FormData()
    formData.append('image', file)

    // Use the configured apiClient so baseURL and interceptors are applied.
    const response = await apiClient.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (err) {
    // Normalize error for the caller
    const message = err?.response?.data?.error || err.message || 'Image upload failed'
    throw new Error(message)
  }
}
