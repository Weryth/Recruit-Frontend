// stores/catalogStore.js
import { defineStore } from 'pinia'
import { fetchCatalogs } from '@/api/catalog'

export const useCatalogStore = defineStore('catalogs', {
  state: () => ({
    statuses: [],
    departments: [],
    recruiters: [],
    physicalFaces: [],
    vacancies: [],
    valutes: [],
  }),

  getters: {
    getAll: (state) => state,
  },

  actions: {
    async initCatalogs() {
      try {
        const res = await fetchCatalogs()

        // Обновляем состояние
        this.statuses = res.statuses || []
        this.departments = res.departments || []
        this.recruiters = res.recruiters || []
        this.physicalFaces = res.physicalFaces || []
        this.vacancies = res.vacancies || []
        this.valutes = res.valutes || []
      } catch (error) {
        console.error('Ошибка fetchCatalogs:', error)
      }
    },
  },
})
