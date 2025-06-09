import { getStatsMounth, getStatsStatus } from '@/api/stats'
import { fetchVacancies } from '@/api/vacancies'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export const useStatsStore = defineStore('stats', () => {
  const state = reactive({
    mounth: [],
    statuses: {
      statuses: [],
      datas: [],
      colour: [],
    },
  })

  const getStats = async () => {
    const data = await getStatsMounth()
    const dataStatuses = await getStatsStatus()
    state.mounth = data
    state.statuses = dataStatuses
  }

  return {
    ...toRefs(state),
    getStats,
  }
})
