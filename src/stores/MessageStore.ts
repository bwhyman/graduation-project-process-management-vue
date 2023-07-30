import { defineStore } from 'pinia'

export const useMessageStore = defineStore('useMessageStore', () => {
  const messageS = ref('')

  return { messageS }
})
