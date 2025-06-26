import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const fetchCatalogs = async () => {
  const authStore = await useAuthStore()
  const response = await axios.get('http://89.169.45.7:3000/api/catalog', {
    headers: {
      Authorization: localStorage.getItem('acessToken'),
    },
  })
  return response.data
}

export const getAnyRecord = async (id: any) => {
    const authStore = await useAuthStore()
    const response = await axios.get(`http://89.169.45.7:3000/api/catalog/any-find/${id}`, {
      headers: {
        Authorization: localStorage.getItem('acessToken'),
      },
    })
    return response.data
  }
