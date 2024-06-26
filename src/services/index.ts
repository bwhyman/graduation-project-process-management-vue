import axios from '@/axios'
import type { Process, ResultVO, User } from '@/types'
import router from '@/router'
import { STUDENT, ADMIN, TEACHER } from '@/services/Const'
import { useProcessStore } from '@/stores/ProcessStore'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
const processStore = useProcessStore()
// login
export const loginService = async (user: User) => {
  try {
    const resp = await axios.post<ResultVO<{ user: User }>>('login', user)
    const us = resp.data.data?.user
    const token = resp.headers.token
    const role = resp.headers.role
    if (!us || !token || !role) {
      throw '登录错误'
    }
    sessionStorage.setItem('token', token)
    userStore.setUserSessionStorage(us, role)
    if (user.number == user.password) {
      router.push('/settings')
      return
    }
    let path = ''
    switch (role) {
      case ADMIN:
        path = '/admin'
        break
      case STUDENT:
        path = '/student'
        break
      case TEACHER:
        path = '/teacher'
        break
    }

    router.push(path)
  } catch (error) {
    //
  }
}

//
export const updateSelfPassword = async (pwd: string) => {
  await axios.post('passwords', { password: pwd })
}

// 加缓存，不为空再发请求
export const listProcessesService = async () => {
  const processesS = processStore.processesS
  if (processesS.value.length > 0) return processesS
  const role = sessionStorage.getItem('role')
  if (role == TEACHER) {
    const resp = await axios.get<ResultVO<{ processes: Process[] }>>('teacher/processes')
    processesS.value = resp.data.data?.processes ?? []
  } else if (role == STUDENT) {
    const resp = await axios.get<ResultVO<{ processes: Process[] }>>('student/processes')
    processesS.value = resp.data.data?.processes ?? []
  }
  return processesS
}

export const getStoreUserService = () => {
  return userStore.userS
}
