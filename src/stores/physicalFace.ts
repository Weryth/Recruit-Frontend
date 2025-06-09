import { fetchPF } from "@/api/physical-face"
import { fetchVacancies } from "@/api/vacancies"
import { defineStore } from "pinia"
import { reactive, toRefs } from "vue"

export const usePFStore = defineStore('physical-face', () => {
    const state = reactive({
      physicalFaces: []
    })
  
    const getPF = async (search = '', recruiter = '') => {
      const data = await fetchPF(search, recruiter)
      state.physicalFaces = data
    }
  
    return {
      ...toRefs(state),
      getPF
    }
  })