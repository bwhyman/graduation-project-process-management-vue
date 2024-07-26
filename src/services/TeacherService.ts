import axios from '@/axios'
import { createProgressNotification } from '@/components/progress'
import { useInfosStore } from '@/stores/InfosStore'
import { useProcessInfosStore } from '@/stores/ProcessInfosStore'
import { useProcessStore } from '@/stores/ProcessStore'
import { useUsersStore } from '@/stores/UsersStore'
import type {
  Process,
  ProcessFile,
  ProcessItem,
  ProcessScore,
  Progress,
  ResultVO,
  StudentAttach,
  User
} from '@/types'
import { StoreCache, StoreClear } from './Decorators'

const TEACHER = 'teacher'

const infosStore = useInfosStore()
const processInfosStore = useProcessInfosStore()
const processStore = useProcessStore()
const usersStore = useUsersStore()

export class TeacherService {
  // 获取指导学生
  @StoreCache(infosStore.tutortudentsS)
  static async listTutorStudentsService() {
    const resp = await axios.get<ResultVO<{ students: User[] }>>(`${TEACHER}/students/tutor`)
    return resp.data.data?.students as unknown as Ref<User[]>
  }

  //
  @StoreCache(infosStore.groupStudentsS)
  static async listGroupStudentsService() {
    const resp = await axios.get<ResultVO<{ students: User[] }>>(`${TEACHER}/students/group`)
    return resp.data.data?.students as unknown as Ref<User[]>
  }

  //
  @StoreCache(infosStore.groupTeachersS)
  static async listGroupTeachersService() {
    const resp = await axios.get<ResultVO<{ teachers: User[] }>>(`${TEACHER}/teachers/group`)
    return resp.data.data?.teachers as unknown as Ref<User[]>
  }

  // 加载指定过程评分
  @StoreCache(processInfosStore.processScoresS)
  static async listProcessesProcessScoresService(pid: string, auth: string) {
    const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>(
      `${TEACHER}/processes/${pid}/types/${auth}`
    )
    return resp.data.data?.processScores as unknown as Ref<ProcessScore[]>
  }

  // 添加评分
  @StoreCache(processInfosStore.processScoresS, true)
  static async addPorcessScoreService(ps: ProcessScore, auth: string) {
    // @ts-ignore
    ps.detail = JSON.stringify(ps.detail)
    const resp = await axios.post<ResultVO<{ processScores: ProcessScore[] }>>(
      `${TEACHER}/processscores/types/${auth}`,
      ps
    )
    return resp.data.data?.processScores as unknown as Ref<ProcessScore[]>
  }

  //
  @StoreCache(processInfosStore.porcessFilesS)
  static async listPorcessFilesService(pid: string, auth: string) {
    const resp = await axios.get<ResultVO<{ processFiles: ProcessFile[] }>>(
      `${TEACHER}/processfiles/${pid}/types/${auth}`
    )
    return resp.data.data?.processFiles as unknown as Ref<ProcessFile[]>
  }

  // 获取全部教师
  @StoreCache(usersStore.allTeachersS)
  static async listTeachersService() {
    const resp = await axios.get<ResultVO<{ teachers: User[] }>>(`${TEACHER}/teachers`)
    return resp.data.data?.teachers as unknown as Ref<User[]>
  }

  // 获取全部学生评分
  @StoreCache(processInfosStore.allProcessScoresS)
  static async getAllProcessScoresService() {
    const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>(
      `${TEACHER}/processscores`
    )
    return resp.data.data?.processScores as unknown as Ref<ProcessScore[]>
  }

  //
  static getProcessFileService = async (name: string) => {
    const pname = encodeURIComponent(name)
    const progressR = ref<{ progress: Progress }>({
      progress: { percentage: 0, title: name, rate: 0, total: 0, loaded: 0 }
    })
    const progNotif = createProgressNotification(progressR.value)
    const resp = await axios.get(`${TEACHER}/download/${pname}`, {
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

  // 加载小组全部评分
  @StoreCache(processInfosStore.groupProcessScoresS)
  static async listProcessScoresGroupService() {
    const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>(
      `${TEACHER}/processscores/groups`
    )
    return resp.data.data?.processScores as unknown as Ref<ProcessScore[]>
  }

  //
  static resetPasswordService = async (number: string) => {
    const resp = await axios.put<ResultVO<{ number: number }>>(`${TEACHER}/passwords/${number}`)
    return resp.data.data?.number
  }

  // 添加过程
  @StoreCache(processStore.processesS, true)
  static async addProcessService(ps: Process) {
    if ((ps.items as ProcessItem[])?.length > 0) {
      // @ts-ignore
      ps.items = JSON.stringify(ps.items)
    }
    if ((ps.studentAttach as StudentAttach[])?.length > 0) {
      // @ts-ignore
      ps.studentAttach = JSON.stringify(ps.studentAttach)
    }
    const resp = await axios.post<ResultVO<{ processes: Process[] }>>(`${TEACHER}/processes`, ps)
    return resp.data.data?.processes as unknown as Ref<Process[]>
  }

  //
  @StoreCache(processStore.processesS, true)
  static async delProcessService(pid: string) {
    const resp = await axios.delete<ResultVO<{ processes: Process[] }>>(
      `${TEACHER}/processes/${pid}`
    )
    return resp.data.data?.processes as unknown as Ref<Process[]>
  }

  //
  @StoreCache(processStore.processesS, true)
  static async updateProcessService(process: Process) {
    // @ts-ignore
    process.items = JSON.stringify(process.items)
    // @ts-ignore
    process.studentAttach = JSON.stringify(process.studentAttach)
    const resp = await axios.patch<ResultVO<{ processes: Process[] }>>(
      `${TEACHER}/processes`,
      process
    )
    return resp.data.data?.processes as unknown as Ref<Process[]>
  }

  //
  @StoreCache(usersStore.allStudentsS, true)
  static async addStudentsService(students: User[]) {
    students.forEach((stu) => {
      //@ts-ignore
      stu.student && (stu.student = JSON.stringify(stu.student))
    })
    const resp = await axios.post<ResultVO<{ students: User[] }>>(`${TEACHER}/students`, students)
    return resp.data.data?.students as unknown as Ref<User[]>
  }

  // 更新学生信息
  @StoreClear(infosStore.clear)
  @StoreCache(usersStore.allStudentsS, true)
  static async updateStudentsService(students: User[]) {
    students.forEach((stu) => {
      //@ts-ignore
      stu.student && (stu.student = JSON.stringify(stu.student))
    })
    const resp = await axios.patch<ResultVO<{ students: User[] }>>(`${TEACHER}/students`, students)
    return resp.data.data?.students as unknown as Ref<User[]>
  }

  @StoreCache(usersStore.allStudentsS)
  static async listStudentsService() {
    const resp = await axios.get<ResultVO<{ students: User[] }>>(`${TEACHER}/students`)
    return resp.data.data?.students as unknown as Ref<User[]>
  }

  //
  static getStudentService = async (account: string) => {
    const resp = await axios.get<ResultVO<{ user: User }>>(`${TEACHER}/users/${account}`)
    return resp.data.data?.user
  }
}
