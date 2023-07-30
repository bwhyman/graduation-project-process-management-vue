import { defineStore } from 'pinia'

export const useSettingStore = defineStore('useSettingStore', () => {
  const showResetPasswordS = ref(false)
  const showSettingS = ref(false)
  return { showResetPasswordS, showSettingS }
})
