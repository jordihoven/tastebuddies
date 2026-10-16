import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './styles/style.css'

// warm up the Supabase host so recipe images start fetching sooner
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
if (supabaseUrl) {
  const preconnect = document.createElement('link')
  preconnect.rel = 'preconnect'
  preconnect.href = supabaseUrl
  document.head.appendChild(preconnect)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
