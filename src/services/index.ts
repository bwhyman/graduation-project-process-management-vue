import axios from '@/axios'
import type { Process, ResultVO, User } from '@/types/type'
import router from '@/router'
import { STUDENT, ADMIN, TEACHER } from '@/services/Const'
import { useSettingStore } from '@/stores/SettingStore'

import { useProcessStore } from '@/stores/ProcessStore'

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

  const resp = await axios.get<ResultVO<{ processes: Process[] }>>('processes')
  processesR = resp.data.data?.processes ?? []
  processesR.forEach((p) => {
    p.studentAttach?.forEach((ps) => {
      processStore.studentProcessesS.push({
        processId: p.id,
        name: ps.name,
        ext: ps.ext
      })
    })
  })

  processStore.processesS = processesR = resp.data.data?.processes ?? []
}
