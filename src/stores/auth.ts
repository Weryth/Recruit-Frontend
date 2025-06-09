// src/store/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: '',
  }),
  actions: {
    async login(email: string, password: string): Promise<boolean> {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      if (!response.ok) {
        return false
      }
  
      const data = await response.json()
  
      // Пример: предполагаем, что API возвращает токен
      if (data.acessToken) {
        this.isAuthenticated = true
        this.token = data.acessToken
        localStorage.setItem('acessToken', data.acessToken)
        return true
      }
  
      return false
    },
    logout() {
      this.isAuthenticated = false
      this.token = ''
      localStorage.removeItem('acessToken')
    },
    async checkToken(): Promise<boolean> {
        console.log("check")
        const token = localStorage.getItem('acessToken')
        if (!token) return false
  
        try {
          const res = await fetch('http://localhost:3000/api/auth', {
            method: 'GET',
            headers: {
              'Authorization': `${token}`
            }
          })
  
          if (res.ok) {
            console.log("ok")
            this.token = token
            this.isAuthenticated = true
            return true
          } else {
            this.logout()
            return false
          }
        } catch {
          this.logout()
          return false
        }
      }
  },
})
