import { fetchCandidats } from "@/api/users"
import { defineStore } from "pinia"
import { reactive, toRefs } from "vue"

export const useUsersStore = defineStore('users', () => {
    const state = reactive({
      users: []
    })
  
    const getUsers = async (search = '', recruiter = '') => {
      const data = await fetchCandidats(search, recruiter)
      state.users = data
    }
  
    return {
      ...toRefs(state), // <-- превращает в реактивные поля
      getUsers
    }
  })