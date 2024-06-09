import axios from '@/axios'
import type { ProcessFile, ProcessScore, Progress, ResultVO, User } from '@/types'
import { useInfosStore } from '@/stores/InfosStore'
import { createProgressNotification } from '@/components/progress'

// 获取指导学生
export const listTutorStudentsService = async () => {
  const groupStore = useInfosStore()
  if (groupStore.tutortudentsS.length > 0) return groupStore.tutortudentsS
  const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/students/tutor')
  const tutortudentsR = storeToRefs(groupStore).tutortudentsS
  tutortudentsR.value = resp.data.data?.students ?? []
  return resp.data.data?.students
}

//
export const listGroupStudentsService = async () => {
  const groupStore = useInfosStore()
  if (groupStore.groupStudentsS.length > 0) return groupStore.groupStudentsS
  const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/students/group')
  const gstudentsR = storeToRefs(groupStore).groupStudentsS
  gstudentsR.value = resp.data.data?.students ?? []
  return gstudentsR.value
}

//
export const listGroupTeachersService = async () => {
  const groupStore = useInfosStore()
  if (groupStore.groupTeachersS.length > 0) return groupStore.groupTeachersS
  const resp = await axios.get<ResultVO<{ teachers: User[] }>>('teacher/teachers/group')
  const groupTeachers = storeToRefs(groupStore).groupTeachersS
  groupTeachers.value = resp.data.data?.teachers ?? []
  return groupTeachers.value
}

// 加载指定过程评分
export const listProcessScoresService = async (pid: string, auth: string) => {
  const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>(
    `teacher/processes/${pid}/types/${auth}`
  )
  return resp.data.data?.processScores ?? []
}

// 添加评分
export const addPorcessScoreService = async (ps: ProcessScore, auth: string) => {
  // @ts-ignore
  ps.detail = JSON.stringify(ps.detail)
  const resp = await axios.post<ResultVO<{ processScores: ProcessScore[] }>>(
    `teacher/processscores/types/${auth}`,
    ps
  )
  return resp.data.data?.processScores ?? []
}

//
export const listPorcessFilesService = async (pid: string, auth: string) => {
  const resp = await axios.get<ResultVO<{ processFiles: ProcessFile[] }>>(
    `teacher/processfiles/${pid}/types/${auth}`
  )
  return resp.data.data?.processFiles ?? []
}

// 获取未选择导师学生列表
export const getUnselectedStudentsService = async () => {
  const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/unselected')
  const students = resp.data.data?.students ?? []
  return students
}

// 获取全部学生。用于生成表格
export const getStudentsService = async () => {
  const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/students')
  const students = resp.data.data?.students ?? []
  return students
}
// 获取全部教师
export const getTeachersService = async () => {
  const resp = await axios.get<ResultVO<{ teachers: User[] }>>('teacher/teachers')
  const teachers = resp.data.data?.teachers
  return teachers
}

// 获取全部评分
export const getProcessScoresService = async () => {
  const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>('teacher/processscores')
  const ps = resp.data.data?.processScores
  return ps
}

//
export const getProcessFileService = async (name: string) => {
  const pname = encodeURIComponent(name)
  const progressR = ref<{ progress: Progress }>({
    progress: { percentage: 0, title: name, rate: 0, total: 0, loaded: 0 }
  })
  const progNotif = createProgressNotification(progressR.value)
  const resp = await axios.get(`teacher/download/${pname}`, {
    responseType: 'blob',
    onDownloadProgress(ProgressEvent) {
      if (!ProgressEvent) return
      progressR.value.progress.percentage = ProgressEvent.progress ?? 0
      progressR.value.progress.rate = ProgressEvent.rate ?? 0
      progressR.value.progress.loaded = ProgressEvent.loaded ?? 0
      progressR.value.progress.total = ProgressEvent.total ?? 0
    }
  })
  progNotif.close()
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

//
export const listProcessScoresGroupService = async () => {
  const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>(
    'teacher/processscores/groups'
  )
  return resp.data.data?.processScores ?? []
}

//
export const updatePassword = async (number: string) => {
  const resp = await axios.put<ResultVO<{ number: number }>>(`teacher/passwords/${number}`)
  return resp.data.data?.number
}
