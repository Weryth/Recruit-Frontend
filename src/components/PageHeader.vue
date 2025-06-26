<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ title }}</h1>
    <div class="action-header-container">
      <div class="navigation-select">
        <el-select-v2
          v-model="selectedRoute"
          :options="routeOptions"
          :placeholder="dynamicPlaceholder"
          @change="navigate"
          style="width: 300px"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedRoute = ref(null)

defineProps({
  title: String,
})

const routeOptions = [
  { value: '/main', label: 'Главная страница' },
  { value: '/candidate', label: 'Кандидат' },
  { value: '/vacancies', label: 'Вакансии' },
  { value: '/physical-faces', label: 'Физические лица' },
  { value: '/chat', label: 'Общий чат' },
  { value: '/admin', label: 'Панель администратора' },
  { value: '/dev', label: 'Для разработчиков' },
  { value: '/logout', label: 'Выход' },
  
]

const dynamicPlaceholder = computed(() => {
  switch (route.path) {
    case '/main':
      return 'Главная страница'
    case '/candidate':
      return 'Страница кандидатов'
    case '/vacancies':
      return 'Вакансии'
    case '/physical-faces':
      return 'Физические лица'
    case '/settings':
      return 'Настройки аккаунта'
    case '/chat':
      return 'Общий чат'
    default:
      return 'Выберите страницу'
  }
})

function navigate(path) {
  if (path) {
    if(path == "/dev"){
      window.location.href = 'https://documenter.getpostman.com/view/22551972/2sB2x3otTq'
      return
    }
    router.push(path)
  }
}
</script>
