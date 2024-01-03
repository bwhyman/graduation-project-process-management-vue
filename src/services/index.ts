import axios from '@/axios'
import type { Process, ResultVO, User } from '@/types'
import router from '@/router'
import { STUDENT, ADMIN, TEACHER } from '@/services/Const'
import { useSettingStore } from '@/stores/SettingStore'

import { useProcessStore } from '@/stores/ProcessStore'
import type { AxiosResponse } from 'axios'

const settingStore = useSettingStore()
const processStore = useProcessStore()

// login
export const loginService = async (user: User) => {
  try {
    const resp = await axios.post<ResultVO<{ user: User }>>('login', user)

    const us = resp.data.data?.user
    const token = resp.headers.token
    const role = resp.headers.role

    sessionStorage.setItem('role', role)
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('user', JSON.stringify(us))

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
  let processesR = processStore.processesS
  if (processesR.length > 0) return processesR
  const role = sessionStorage.getItem('role')
  if (role == TEACHER) {
    const resp = await axios.get<ResultVO<{ processes: Process[] }>>('teacher/processes')
    processesR = resp.data.data?.processes ?? []
  } else if (role == STUDENT) {
    const resp = await axios.get<ResultVO<{ processes: Process[] }>>('student/processes')
    processesR = resp.data.data?.processes ?? []
  }

  processStore.processesS = processesR
}
