import axios from '@/axios'
import type { ProcessFile, ProcessScore, ResultVO, User } from '@/types/type'
import { useGroupInfosStore } from '@/stores/GroupInfosStore'
import { parseProcessScores, parseStudents, parseTeachers } from './ParseUtils'

// 加载指导学生/组学生/组评审，信息
export const getInfosService = async () => {
  const groupStore = useGroupInfosStore()
  const gstudentsR = storeToRefs(groupStore).groupStudentsS
  const gteachersR = storeToRefs(groupStore).groupTeachersS
  const tutortudentsR = storeToRefs(groupStore).tutortudentsS

  const resp = await axios.get<
    ResultVO<{ students: User[]; teachers: User[]; tutorStudents: User[] }>
  >(`teacher/infos`)
  const stus = resp.data.data?.students
  const teas = resp.data.data?.teachers
  const tutorStus = resp.data.data?.tutorStudents

  stus && (gstudentsR.value = parseStudents(stus))
  teas && (gteachersR.value = parseTeachers(teas))
  tutorStus && parseStudents(tutorStus) && (tutortudentsR.value = parseStudents(tutorStus))
  // 学生按答辩顺序排序
  gstudentsR.value.sort((x, y) => (x.queueNumber ?? 0) - (y.queueNumber ?? 0))
}

//
export const listProcessScoresService = async (pid: string, auth: string) => {
  const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>(
    `teacher/processes/${pid}/types/${auth}`
  )
  return parseProcessScores(resp.data.data?.processScores ?? [])
}

//
export const addPorcessScore = async (
  ps: {
    score: number
    processId: string
    studentId: string
  },
  auth: string
) => {
  const resp = await axios.post<ResultVO<{ processScores: ProcessScore[] }>>(
    `teacher/processscores/types/${auth}`,
    ps
  )
  return parseProcessScores(resp.data.data?.processScores ?? [])
}

export const listPorcessFilesService = async (pid: string, auth: string) => {
  const resp = await axios.get<ResultVO<{ processFiles: ProcessFile[] }>>(
    `teacher/processfiles/${pid}/types/${auth}`
  )
  return resp.data.data?.processFiles
}

//
export const getUnselectedStudentsService = async () => {
  const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/unselected')
  const students = resp.data.data?.students
  return { students }
}

//
export const getStudentsService = async () => {
  const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/students')
  const students = resp.data.data?.students
  return { students }
}

//
export const getProcessFile = async (pname: string) => {
  pname = encodeURIComponent(pname)
  const resp = await axios.get(`teacher/download/${pname}`, { responseType: 'blob' })
  const filename = decodeURIComponent(resp.headers['filename'])
  const url = window.URL.createObjectURL(new Blob([resp.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}
