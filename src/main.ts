import { createApp } from 'vue'
import App from './App.vue'
import { createMessageDialog } from './components/message'
import router from './router'
//import.meta.env.DEV && (await import('@/mock/index'))

const app = createApp(App)

app.use(router)

app.mount('#app')
app.config.errorHandler = (err) => {
  const error = err as string
  console.error(error)
  createMessageDialog(error)
}
