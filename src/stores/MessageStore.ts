import { defineStore } from 'pinia'

export const useMessageStore = defineStore('useMessageStore', () => {
  const messageS = ref('')
  const closeF = ref<() => void>()

  return { messageS, closeF }
})
