import type { Process } from '@/types'
import { render } from 'vue'

export const createEditProcessDialog = (process: Process) => {
  const node = h(
    defineAsyncComponent(() => import('./EditPorcessVue.vue')),
    { process }
  )
  render(node, document.body)
}
