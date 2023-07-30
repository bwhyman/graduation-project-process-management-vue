import axios from '@/axios'
import type {
  Process,
  ProcessItem,
  ResultVO,
  Student,
  StudentProcess,
  Teacher,
  User
} from '@/types/type'
import { useMessageStore } from '@/stores/MessageStore'
import { parseProcesses, parseStudents, parseTeachers } from './ParseUtils'
import { useProcessStore } from '@/stores/ProcessStore'

const messageStore = useMessageStore()
const messageR = storeToRefs(messageStore).messageS

//
export const updateStartTime = async (time: string) => {
  await axios.put<ResultVO<{}>>(`admin/starttime/${time}`)
  messageR.value = '修改时间成功'
}

//
export const updatePassword = async (number: string) => {
  await axios.put<ResultVO<{}>>(`admin/passwords/${number}`)
  messageR.value = '密码重置成功'
}

//
export const addStudents = async (students: User[]) => {
  await axios.post('admin/students', students)
  messageR.value = '学生添加成功'
}

export const addTeachers = async (teachers: Teacher[]) => {
  teachers.forEach((t) => (t.teacher = JSON.stringify(t.teacher)))
  await axios.post('admin/teachers', teachers)
  messageR.value = '导师添加成功'
}

//
export const addProjectTitles = async (titles: Student[]) => {
  await axios.post<ResultVO<{}>>('admin/students/projects', titles)
  messageR.value = '题目导入成功'
}

//
export const updateGroupAndQueue = async (students: Student[]) => {
  await axios.post('admin/grouping', students)
  messageR.value = '更新学生分组成功'
}

//
export const getGroupInfo = async () => {
  const resp = await axios.get<ResultVO<{ students: User[]; teachers: User[] }>>('admin/grouping')
  const teachers = resp.data.data?.teachers && parseTeachers(resp.data.data?.teachers)
  const students = resp.data.data?.students && parseStudents(resp.data.data?.students)
  return { students, teachers }
}

//
export const addProcessService = async (ps: Process) => {
  if ((ps.items as ProcessItem[])?.length > 0) {
    ps.items = JSON.stringify(ps.items)
  }
  if ((ps.studentAttach as StudentProcess[])?.length > 0) {
    ps.studentAttach = JSON.stringify(ps.studentAttach)
  }
  const resp = await axios.post<ResultVO<{ processes: Process[] }>>('admin/processes', ps)
  console.log(resp.data.data?.processes)

  resp.data.data?.processes && parseProcesses(resp.data.data?.processes)
  const processStore = useProcessStore()
  const processesR = storeToRefs(processStore).processesS
  resp.data.data?.processes && (processesR.value = resp.data.data?.processes)
  messageR.value = '添加过程成功'
}

export const resetData = async () => {
  const resp = await axios.post('admin/resetdata')
  messageR.value = '数据重置成功'
}
