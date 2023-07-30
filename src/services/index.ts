import axios from '@/axios'
import { useUserStore } from '@/stores/UserStore'
import type { Process, ResultVO, User } from '@/types/type'
import router from '@/router'
import { STUDENT, ADMIN, TEACHER } from '@/services/Const'
import { useSettingStore } from '@/stores/SettingStore'
import { useMessageStore } from '@/stores/MessageStore'

import { parseProcesses } from './ParseUtils'
import { useProcessStore } from '@/stores/ProcessStore'

const userStore = useUserStore()
const SettingStore = useSettingStore()
const messageStore = useMessageStore()
const messageR = storeToRefs(messageStore).messageS
// login
export const loginService = async (user: User) => {
  try {
    const resp = await axios.post<ResultVO<{ user: User }>>('login', user)

    // 账号密码相同
    user.number == user.password && (SettingStore.showResetPasswordS = true)
    const us = resp.data.data?.user
    const token = resp.headers.token
    const role = resp.headers.role
    role && sessionStorage.setItem('role', role)
    token && sessionStorage.setItem('token', token)

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
    us && userStore.setUserS(us)
    router.push(path)
  } catch (error) {
    //
  }
}

//
export const updateSelfPassword = async (pwd: string) => {
  await axios.post('passwords', { password: pwd })
  messageR.value = '密码更新成功'
}

// 加缓存，不为空再发请求
export const listProcessesService = async () => {
  const processStore = useProcessStore()
  const processesR = storeToRefs(processStore).processesS
  if (processesR.value.length > 0) return

  const studentPR = storeToRefs(useProcessStore()).studentProcessesS

  const resp = await axios.get<ResultVO<{ processes: Process[] }>>('processes')
  const result = resp.data.data?.processes
  result && parseProcesses(result) && (processesR.value = result)
  processesR.value.forEach((p) => {
    p.studentAttach &&
      (p.studentAttach as { name: string }[]).forEach((sa) => {
        studentPR.value.push({ processId: p.id, name: sa.name })
      })
  })
}
