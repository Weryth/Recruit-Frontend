import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const fetchCandidats = async (query: string, recruiter?: string) => {
  const authStore = useAuthStore()

  const response = await axios.get('http://localhost:3000/api/candidate', {
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

export const updateCandidate = async (data: any) => {
  const response = await axios.post(
    'http://localhost:3000/api/candidate/update',
    data,
    {
      headers: {
        Authorization: localStorage.getItem('acessToken')
      }
    }
  )
}

export const createRecruiter = async (data: any) => {
  const authStore = useAuthStore()

  const response = await axios.post(
    'http://localhost:3000/api/auth/reg',
    {
      email: data.email,
      password: data.password,
      pfId: data.pfId,
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

export const getCurUser = async () => {
  const response = await axios.get('http://localhost:3000/api/auth/curUser', {
    headers: {
      Authorization: localStorage.getItem('acessToken'),
    },
  })
  console.log(response.data)
  return response.data
}
