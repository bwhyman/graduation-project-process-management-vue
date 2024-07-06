import axios from '@/axios'
import type { Process, ResultVO, User } from '@/types'
import router from '@/router'
import { STUDENT, ADMIN, TEACHER } from '@/services/Const'
import { useProcessStore } from '@/stores/ProcessStore'
import { useUserStore } from '@/stores/UserStore'
import { StoreCache } from './descriptor'

const userStore = useUserStore()
const processStore = useProcessStore()

export class CommonService {
  // login
  static loginService = async (user: User) => {
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
  static updateSelfPassword = async (pwd: string) => {
    await axios.post('passwords', { password: pwd })
  }

  // 加缓存，不为空再发请求
  @StoreCache(processStore.processesS)
  static async listProcessesService() {
    const role = sessionStorage.getItem('role')
    let url = ''
    if (role == TEACHER) {
      url = 'teacher/processes'
    } else if (role == STUDENT) {
      url = 'student/processes'
    }
    const resp = await axios.get<ResultVO<{ processes: Process[] }>>(url)
    return resp.data.data?.processes as unknown as Ref<Process[]>
  }

  static getStoreUserService = () => userStore.userS
}
