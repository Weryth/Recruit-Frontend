import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const fetchPF = async (query: string, recruiter?: string) => {
  const authStore = useAuthStore()

  const response = await axios.get('http://localhost:3000/api/physical-face', {
    headers: {
      Authorization: localStorage.getItem('acessToken'),
    },
    params: {
      search: query,
      recruiter,
    },
  })
  console.log(response.data)
  return response.data
}

export const createPF = async (data: any) => {
  const authStore = useAuthStore()

  const response = await axios.post(
    'http://localhost:3000/api/physical-face/create',
    {
      firsName: data.firsName,
      lastname: data.lastname,
      familia: data.familia,
      fullname: `${data.firsName} ${data.lastname} ${data.familia}`,
      inn: data.inn,
      passport: data.passport,
      snils: data.snils,
    },
    {
      headers: {
        Authorization: localStorage.getItem('acessToken'),
      },
    },
  )
  //console.log(response.data)
  return response.data
}

export const updatePF= async (data: any) => {
  const response = await axios.post(
    'http://localhost:3000/api/physical-face/update',
    {
      faceId: data.id,
      firsName: data.firsName,
      lastname: data.lastname,
      familia: data.familia,
      fullname: `${data.firsName} ${data.lastname} ${data.familia}`,
      inn: data.inn,
      passport: data.passport,
      snils: data.snils
    },
    {
      headers: {
        Authorization: localStorage.getItem('acessToken'),
      },
    },
  )
}
