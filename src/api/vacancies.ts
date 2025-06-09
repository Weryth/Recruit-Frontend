import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const fetchVacancies = async (query: string, recruiter?: string) => {
  const authStore = useAuthStore()

  const response = await axios.get('http://localhost:3000/api/vacancies', {
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

export const createVacancy = async (data: any) => {
  const authStore = useAuthStore()

  const response = await axios.post(
    'http://localhost:3000/api/vacancies/create',
    {
      vacancyName: data.vacancyName,
      vacancyDesc: data.vacancyDesc,
      pay: Number(data.pay),
      valute: data.valute,
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
export const updateVacancy = async (data: any) => {
  const response = await axios.post('http://localhost:3000/api/vacancies/update', data, {
    headers: {
      Authorization: localStorage.getItem('acessToken'),
    },
  })
}
