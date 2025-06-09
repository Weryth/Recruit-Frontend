import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const createCandidate = async (data: any) => {
  const authStore = useAuthStore()

  const response = await axios.post(
    'http://localhost:3000/api/candidate/create',
    {
      statusID: data.statusID,
      physicalFaceID: data.physicalFaceID,
      vacancyId: data.vacancyId,
      physicalFaceData: {
        firsName: data.name_,
        lastname: data.patronimic_,
        familia: data.familia_,
        fullname: data.fullname_,
        inn: data.inn_,
        passport: data.passport_,
        snils: data.snils_,
      },
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
