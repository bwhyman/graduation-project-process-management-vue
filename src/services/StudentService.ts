import axios from '@/axios'
import { useUserStore } from '@/stores/UserStore'
import type { ResultVO, User } from '@/types/type'

import { parseStudent, parseTeachers } from './ParseUtils'
import { useMessageStore } from '@/stores/MessageStore'

const userStore = useUserStore()
const messageStore = useMessageStore()
const messageR = storeToRefs(messageStore).messageS
//
export const listTeachers = async () => {
  const resp = await axios.get<ResultVO<{ starttime: string; teachers?: User[] }>>('student/tutors')

  const starttime = resp.data.data?.starttime

  const ts = resp.data.data?.teachers
  // 将teacher中json信息反序列化
  const teachers = ts && parseTeachers(ts)

  return { starttime, teachers }
}

//
export const selectTeacher = async (tid: string) => {
  const resp = await axios.put<ResultVO<{ user?: User; teachers?: User[] }>>(
    `student/tutors/${tid}`
  )
  const teachers = resp.data.data?.teachers

  teachers && parseTeachers(teachers)
  const student = resp.data.data?.user
  if (student) {
    parseStudent(student)
    userStore.userS = student
    sessionStorage.setItem('user', JSON.stringify(userStore.userS))
  }

  return { teachers }
}

export const uploadFileService = async (fdata: FormData) => {
  const resp = await axios.post('student/upload', fdata)
  messageR.value = '上传成功'
}
