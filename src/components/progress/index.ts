import type { Progress } from '@/types'
import ProgressVue from './ProgressVue.vue'

export const createProgressNotification = (progress: { progress: Progress }) => {
  const noti = ElNotification({
    title: 'Loading',
    message: h(ProgressVue, progress),
    type: 'success',
    duration: 0
  })

  const close = () => noti.close()
  return { close }
}
