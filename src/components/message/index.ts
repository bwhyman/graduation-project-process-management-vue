import { render } from 'vue'

// 创建函数式组件
export const createMessageDialog = (msg: string, close: Function = () => {}) => {
  const node = h(
    defineAsyncComponent(() => import('./ConfirmMessage.vue')),
    { message: msg, close }
  )
  render(node, document.body)
}

export const createElNotificationSuccess = (msg: string) => {
  ElNotification({
    title: 'Success',
    message: msg,
    type: 'success'
  })
}
