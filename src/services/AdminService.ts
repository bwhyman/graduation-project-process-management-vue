import axios from '@/axios'
import type { Process, ProcessItem, ResultVO, Student, StudentAttach, Teacher, User } from '@/types'
import { useProcessStore } from '@/stores/ProcessStore'
import { createElNotificationSuccess } from '@/components/message'

//
export const updateStartTime = async (time: string) => {
  await axios.put<ResultVO<{}>>(`admin/starttime/${time}`)
  createElNotificationSuccess('修改时间成功')
}

//
export const addStudents = async (students: User[]) => {
  students.forEach((stu) => {
    //@ts-ignore
    stu.student = JSON.stringify(stu.student)
  })
  await axios.post('admin/students', students)
  createElNotificationSuccess('学生添加成功')
}

export const addTeachers = async (teachers: Teacher[]) => {
  teachers.forEach((t) => {
    // @ts-ignore
    t.teacher = JSON.stringify(t.teacher)
  })
  await axios.post('admin/teachers', teachers)
  createElNotificationSuccess('导师添加成功')
}

//
export const addProjectTitles = async (titles: Student[]) => {
  await axios.post<ResultVO<{}>>('admin/students/projects', titles)
  createElNotificationSuccess('题目导入成功')
}

//
export const updateGroupAndQueue = async (students: Student[]) => {
  await axios.post('admin/grouping', students)
  createElNotificationSuccess('更新学生分组成功')
}

//
export const getGroupInfo = async () => {
  const resp = await axios.get<ResultVO<{ students: User[]; teachers: User[] }>>('admin/grouping')
  const teachers = resp.data.data?.teachers ?? []
  const students = resp.data.data?.students ?? []
  return { students, teachers }
}

//
export const addProcessService = async (ps: Process) => {
  if ((ps.items as ProcessItem[])?.length > 0) {
    // @ts-ignore
    ps.items = JSON.stringify(ps.items)
  }
  if ((ps.studentAttach as StudentAttach[])?.length > 0) {
    // @ts-ignore
    ps.studentAttach = JSON.stringify(ps.studentAttach)
  }
  const resp = await axios.post<ResultVO<{ processes: Process[] }>>('admin/processes', ps)
  const processStore = useProcessStore()
  const processesR = storeToRefs(processStore).processesS
  processesR.value = resp.data.data?.processes ?? []
}

export const resetData = async () => {
  await axios.post('admin/resetdata')
  createElNotificationSuccess('数据重置成功')
}

export const listTeachersService = async () => {
  const resp = await axios.get<ResultVO<{ teachers: Teacher[] }>>('admin/teachers')
  const teachers = resp.data.data?.teachers ?? []
  return teachers
}

//
export const addStudentsAll = async (students: Student[]) => {
  await axios.post('admin/students/all', students)
  createElNotificationSuccess('更新学生成功')
}
//
export const listProcessesService = async () => {
  const processStore = useProcessStore()
  let processesR = processStore.processesS
  if (processesR.length > 0) return processesR
  const resp = await axios.get<ResultVO<{ processes: Process[] }>>('admin/processes')
  processesR = resp.data.data?.processes ?? []
  processStore.processesS = processesR
  return processesR
}
//
export const delProcessService = async (pid: string) => {
  const resp = await axios.delete<ResultVO<{ processes: Process[] }>>(`admin/processes/${pid}`)
  const processStore = useProcessStore()
  processStore.processesS = resp.data.data?.processes ?? []
  return true
}

//
export const updateProcessService = async (process: Process) => {
  // @ts-ignore
  process.items = JSON.stringify(process.items)
  // @ts-ignore
  process.studentAttach = JSON.stringify(process.studentAttach)
  const resp = await axios.patch<ResultVO<{ processes: Process[] }>>('admin/processes', process)
  const processStore = useProcessStore()
  processStore.processesS = resp.data.data?.processes ?? []
}

//
export const getUserService = async (account: string) => {
  const resp = await axios.get<ResultVO<{ student: Student }>>(`admin/users/${account}`)
  return resp.data.data?.student
}
//
export const updateStudentTeacherService = async (sid: string, student: Student) => {
  const user: User = { student: student }
  // @ts-ignore
  user.student = JSON.stringify(user.student)
  const resp = axios.patch(`admin/students/${sid}/student`, user)
  return true
}
//
export const updateUserGroupService = async (user: User) => {
  const resp = await axios.patch('admin/groups', user)
  return true
}
