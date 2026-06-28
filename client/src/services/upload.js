import axios from 'axios'
import { apiClient } from './api'

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  const response = await axios.post(`${apiClient.defaults.baseURL}/uploads`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}
