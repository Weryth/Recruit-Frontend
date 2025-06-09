import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import vDrag from 'v-drag'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/styles/main.scss'

const app = createApp(App)
app.use(vDrag)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
