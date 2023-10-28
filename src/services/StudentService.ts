import axios from '@/axios'
import { useUserStore } from '@/stores/UserStore'
import type { ResultVO, User } from '@/types/type'

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
export const uploadFileService = async (fdata: FormData) => {
  await axios.post('student/upload', fdata)
  return true
}
