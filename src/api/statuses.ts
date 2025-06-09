import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

export const createStatus = async (data: any) => {
  const authStore = useAuthStore()

  const response = await axios.post(
    'http://localhost:3000/api/statuses/create',
    {
      statusName: data.statusName,
      statusDesc: data.statusDesc,
      objectToConnect: 'CANDIDATE',
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


