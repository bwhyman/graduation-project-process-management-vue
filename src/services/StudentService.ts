import axios from '@/axios'
import { useUserStore } from '@/stores/UserStore'
import type { ProcessFile, ResultVO, User } from '@/types'

const userStore = useUserStore()
//
export const listTeachersService = async () => {
  const resp = await axios.get<ResultVO<{ starttime: string; teachers?: User[] }>>('student/tutors')

  const starttime = resp.data.data?.starttime
  const teachers = resp.data.data?.teachers

  return { starttime, teachers }
}

//
export const selectTeacher = async (tid: string) => {
  const resp = await axios.put<ResultVO<{ user?: User; teachers?: User[] }>>(
    `student/tutors/${tid}`
  )
  const teachers = resp.data.data?.teachers

  const student = resp.data.data?.user
  if (student) {
    storeToRefs(userStore).userS.value = student
    sessionStorage.setItem('user', JSON.stringify(student))
  }

  return { teachers }
}

//
export const uploadFileService = async (pid: string, num: number, fdata: FormData) => {
  const resp = await axios.post<ResultVO<{ processfiles: ProcessFile[] }>>(
    `student/upload/${pid}/numbers/${num}`,
    fdata
  )
  return resp.data.data?.processfiles ?? []
}
//
export const listProcessFilesService = async (pid: string) => {
  const resp = await axios.get<ResultVO<{ processfiles: ProcessFile[] }>>(
    `student/processfiles/${pid}`
  )

  return resp.data.data?.processfiles ?? []
}
