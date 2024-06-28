import type { User } from '@/types'

export const useUserStore = () => {
  const u = sessionStorage.getItem('user')
  const userS = ref<User>(u ? JSON.parse(u) : {})

  return { userS }
}
