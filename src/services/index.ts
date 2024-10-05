import axios, { useGet, usePost } from '@/axios'
import router from '@/router'
import { ADMIN, STUDENT, TEACHER } from '@/services/Const'
import { useProcessStore } from '@/stores/ProcessStore'
import { useUserStore } from '@/stores/UserStore'
import type { Process, ResultVO, User } from '@/types'
import { StoreCache } from './Decorators'

const userStore = useUserStore()
const processStore = useProcessStore()

export class CommonService {
  // login
  static loginService = async (user: User) => {
    const resp = await axios.post<ResultVO<User>>('login', user)
    const us = resp.data.data
    const token = resp.headers.token
    const role = resp.headers.role
    if (!us || !token || !role) {
      throw '登录错误'
    }
    sessionStorage.setItem('token', token)
    userStore.setUserSessionStorage(us, role)
    if (user.number === user.password) {
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
  }

  //
  static updateSelfPassword = async (pwd: string) => {
    await usePost('passwords', { password: pwd })
  }

  // 加缓存，不为空再发请求
  @StoreCache(processStore.processesS)
  static async listProcessesService() {
    const data = await useGet<Process[]>('processes')
    return data as unknown as Ref<Process[]>
  }

  static getRole() {
    return sessionStorage.getItem('role')
  }
}
