import { parseStudent, parseTeacher } from '@/services/ParseUtils'
import type { User } from '@/types/type'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const u = sessionStorage.getItem('user')
  const userS = ref<User>(u ? JSON.parse(u) : {})

  const setUserS = (user: User) => {
    let x = user
    user.student && (x = parseStudent(user))
    user.teacher && (x = parseTeacher(user))
    sessionStorage.setItem('user', JSON.stringify(x))
    x && (userS.value = x)
  }

  return { userS, setUserS }
})
