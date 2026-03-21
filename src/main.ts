import { createApp, toRaw } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'
import './app.css'

const app = createApp(App)
const pinia = createPinia()

// setup store'lara $reset() desteği ekler (Pinia varsayılan olarak sadece option store için destekler)
// structuredClone yerine JSON derin kopya kullanılır, çünkü structuredClone Vue reactive Proxy'lerini işleyemez
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(toRaw(store.$state)))
  store.$reset = () => {
    store.$patch(($state) => {
      Object.assign($state, JSON.parse(JSON.stringify(initialState)))
    })
  }
})

app.use(pinia)
app.use(router)
app.mount('#app')
