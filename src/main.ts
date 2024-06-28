import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
//import.meta.env.DEV && (await import('@/mock/index'))

const app = createApp(App)

app.use(router)

app.mount('#app')
