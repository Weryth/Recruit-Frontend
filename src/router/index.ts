// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
// Импорт других страниц по мере добавления
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useVacanciesStore } from '@/stores/vacancies'
import { useRouter } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  {
    path: '/dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/candidate',
    component: () => import('@/pages/candidate/CandidatePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/main',
    component: () => import('@/pages/MainPage/MainPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/vacancies',
    component: () => import('@/pages/vacancies/VacanciesPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/physical-faces',
    component: () => import('@/pages//physical-faces/PhysicalFaces.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    component: () => import('@/pages/admin/AdminPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/chat',
    component: () => import('@/pages/chat/ChatPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/logout',
    beforeEnter: async (to, from, next) => {
      const auth = useAuthStore()
      await auth.logout()
      next('/login')
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
import { useCatalogStore } from '@/stores/catalogStore'
import { getCurUser } from '@/api/users'
// Middleware для защиты маршрутов

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (to.path === '/logout') {
    await auth.logout()
    return next('/login')
  }

  if(to.path === "/admin"){
    const userData = await getCurUser()
    if(!userData.isAdmin){
      return next('/main')
    }
  }

  const catalogStore = useCatalogStore()
  catalogStore.initCatalogs()

  // const userStore = useUsersStore()
  // //userStore.getUsers()

  // const vacanciesStore = useVacanciesStore()
  // vacanciesStore.getVacancies()



  if (to.meta.requiresAuth) {
    const isValid = await auth.checkToken()
    if (!isValid) {
      await auth.logout() // <- тут может быть logout()
      next('/logout') // <- или редирект
    } else {
      next()
    }
  } else {
    next()
  }

})

export default router
