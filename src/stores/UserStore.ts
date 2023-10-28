import type { User } from '@/types/type'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const u = sessionStorage.getItem('user')
  const userS = ref<User>(u ? JSON.parse(u) : {})

  return { userS }
})
