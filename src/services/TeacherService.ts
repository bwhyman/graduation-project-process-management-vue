import axios, { useDelete, useGet, usePatch, usePost, usePut } from '@/axios'
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
  StudentAttach,
  User
} from '@/types'
import { ELLoading, StoreCache, StoreClear } from './Decorators'

const TEACHER = 'teacher'

const infosStore = useInfosStore()
const processInfosStore = useProcessInfosStore()
const processStore = useProcessStore()
const usersStore = useUsersStore()

export class TeacherService {
  // 获取指导学生
  @StoreCache(infosStore.tutortudentsS)
  static async listTutorStudentsService() {
    const data = await useGet<User[]>(`${TEACHER}/students/tutor`)
    return data as unknown as Ref<User[]>
  }

  //
  @StoreCache(infosStore.groupStudentsS)
  static async listGroupStudentsService() {
    const data = await useGet<User[]>(`${TEACHER}/students/group`)
    return data as unknown as Ref<User[]>
  }

  //
  @StoreCache(infosStore.groupTeachersS)
  static async listGroupTeachersService() {
    const data = await useGet<User[]>(`${TEACHER}/teachers/group`)
    return data as unknown as Ref<User[]>
  }

  // 加载指定过程评分
  @StoreCache(processInfosStore.processScoresS)
  @ELLoading()
  static async listProcessesProcessScoresService(pid: string, auth: string) {
    const data = await useGet<ProcessScore[]>(`${TEACHER}/processes/${pid}/types/${auth}`)
    return data as unknown as Ref<ProcessScore[]>
  }

  // 添加评分
  @StoreClear(processInfosStore.clear)
  @StoreCache(processInfosStore.processScoresS)
  @ELLoading()
  static async addPorcessScoreService(ps: ProcessScore, auth: string) {
    // @ts-ignore
    ps.detail = JSON.stringify(ps.detail)
    const data = await usePost<ProcessScore[]>(`${TEACHER}/processscores/types/${auth}`, ps)
    return data as unknown as Ref<ProcessScore[]>
  }

  //
  @StoreCache(processInfosStore.porcessFilesS)
  static async listPorcessFilesService(pid: string, auth: string) {
    const data = await useGet<ProcessFile[]>(`${TEACHER}/processfiles/${pid}/types/${auth}`)
    return data as unknown as Ref<ProcessFile[]>
  }

  // 获取全部教师
  @StoreCache(usersStore.allTeachersS)
  static async listTeachersService() {
    const data = await useGet<User[]>(`${TEACHER}/teachers`)
    return data as unknown as Ref<User[]>
  }

  // 获取全部学生评分
  @StoreCache(processInfosStore.allProcessScoresS)
  @ELLoading()
  static async getAllProcessScoresService() {
    const data = await useGet<ProcessScore[]>(`${TEACHER}/processscores`)
    return data as unknown as Ref<ProcessScore[]>
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
  @ELLoading()
  static async listProcessScoresGroupService() {
    const data = await useGet<ProcessScore[]>(`${TEACHER}/processscores/groups`)
    return data as unknown as Ref<ProcessScore[]>
  }

  //
  static resetPasswordService = async (number: string) => {
    const data = await usePut<number>(`${TEACHER}/passwords/${number}`)
    return data
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
    const data = await usePost<Process[]>(`${TEACHER}/processes`, ps)
    return data as unknown as Ref<Process[]>
  }

  //
  @StoreCache(processStore.processesS, true)
  static async delProcessService(pid: string) {
    const data = await useDelete<Process[]>(`${TEACHER}/processes/${pid}`)
    return data as unknown as Ref<Process[]>
  }

  //
  @StoreCache(processStore.processesS, true)
  static async updateProcessService(process: Process) {
    // @ts-ignore
    process.items = JSON.stringify(process.items)
    // @ts-ignore
    process.studentAttach = JSON.stringify(process.studentAttach)
    const data = await usePatch<Process[]>(`${TEACHER}/processes`, process)
    return data as unknown as Ref<Process[]>
  }

  //
  @StoreCache(usersStore.allStudentsS, true)
  @ELLoading()
  static async addStudentsService(students: User[]) {
    students.forEach((stu) => {
      //@ts-ignore
      stu.student && (stu.student = JSON.stringify(stu.student))
    })
    const data = await usePost<User[]>(`${TEACHER}/students`, students)
    return data as unknown as Ref<User[]>
  }

  // 更新学生信息
  @StoreClear(infosStore.clear)
  @StoreCache(usersStore.allStudentsS, true)
  @ELLoading()
  static async updateStudentsService(students: User[]) {
    students.forEach((stu) => {
      //@ts-ignore
      stu.student && (stu.student = JSON.stringify(stu.student))
    })
    const data = await usePatch<User[]>(`${TEACHER}/students`, students)
    return data as unknown as Ref<User[]>
  }

  @StoreCache(usersStore.allStudentsS)
  @ELLoading()
  static async listStudentsService() {
    const data = await useGet<User[]>(`${TEACHER}/students`)
    return data as unknown as Ref<User[]>
  }

  //
  static getStudentService = async (account: string) => {
    const data = await useGet<User>(`${TEACHER}/users/${account}`)
    return data
  }

  //
  @StoreClear(usersStore.clear, infosStore.clear)
  static async updateStudentService(student: User) {
    // @ts-ignore
    student.student && (student.student = JSON.stringify(student.student))
    await usePatch(`${TEACHER}/student`, student)
    return true
  }
}
