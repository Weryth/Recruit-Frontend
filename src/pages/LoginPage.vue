<!-- src/pages/LoginPage.vue -->
<template>
  <div class="login-container">
    <div class="left-block"><img :src="logo" alt="Logo" class="logo" /></div>
    <div class="login-page">
      <form @submit.prevent="handleLogin" class="login-form">
        <h2 class="form-title">Система автоматизации HR процессов</h2>
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" id="email" type="email" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input v-model="password" id="password" type="password" class="form-input" required />
        </div>
        <button type="submit" class="form-button">Войти</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logo from '@/assets/logo.svg'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/main')
  } else {
    alert('Неверный логин или пароль')
  }
}
</script>
