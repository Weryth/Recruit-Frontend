import { fetchVacancies } from "@/api/vacancies"
import { defineStore } from "pinia"
import { reactive, toRefs } from "vue"

export const useVacanciesStore = defineStore('vacancies', () => {
    const state = reactive({
      vacancies: []
    })
  
    const getVacancies = async (search = '', recruiter = '') => {
      const data = await fetchVacancies(search, recruiter)
      state.vacancies = data
    }
  
    return {
      ...toRefs(state),
      getVacancies
    }
  })