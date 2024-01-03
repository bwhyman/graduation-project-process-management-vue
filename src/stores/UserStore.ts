import type { User } from '@/types'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const u = sessionStorage.getItem('user')
  const userS = ref<User>(u ? JSON.parse(u) : {})

  return { userS }
})
