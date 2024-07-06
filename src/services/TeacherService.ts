import axios from '@/axios'
import type { ProcessFile, ProcessScore, Progress, ResultVO, Student, Teacher, User } from '@/types'
import { useInfosStore } from '@/stores/InfosStore'
import { createProgressNotification } from '@/components/progress'
import { StoreCache, StoreClear } from './descriptor'
import { useProcessInfosStore } from '@/stores/ProcessInfosStore'
import { useUsersStore } from '@/stores/UsersStore'

const infosStore = useInfosStore()
const processInfosStore = useProcessInfosStore()
const usersStore = useUsersStore()

export class TeacherService {
  // 获取指导学生
  @StoreCache(infosStore.tutortudentsS)
  static async listTutorStudentsService() {
    const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/students/tutor')
    return resp.data.data?.students as unknown as Ref<Student[]>
  }

  //
  @StoreCache(infosStore.groupStudentsS)
  static async listGroupStudentsService() {
    const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/students/group')
    return resp.data.data?.students as unknown as Ref<Student[]>
  }

  //
  @StoreCache(infosStore.groupTeachersS)
  static async listGroupTeachersService() {
    const resp = await axios.get<ResultVO<{ teachers: User[] }>>('teacher/teachers/group')
    return resp.data.data?.teachers as unknown as Ref<Teacher[]>
  }

  // 加载指定过程评分
  @StoreCache(processInfosStore.processScoresS)
  static async listProcessesProcessScoresService(pid: string, auth: string) {
    const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>(
      `teacher/processes/${pid}/types/${auth}`
    )
    return resp.data.data?.processScores as unknown as Ref<ProcessScore[]>
  }

  // 添加评分
  @StoreClear(processInfosStore.clear)
  @StoreCache(processInfosStore.processScoresS)
  static async addPorcessScoreService(ps: ProcessScore, auth: string) {
    // @ts-ignore
    ps.detail = JSON.stringify(ps.detail)
    const resp = await axios.post<ResultVO<{ processScores: ProcessScore[] }>>(
      `teacher/processscores/types/${auth}`,
      ps
    )
    return resp.data.data?.processScores as unknown as Ref<ProcessScore[]>
  }

  //
  @StoreCache(processInfosStore.porcessFilesS)
  static async listPorcessFilesService(pid: string, auth: string) {
    const resp = await axios.get<ResultVO<{ processFiles: ProcessFile[] }>>(
      `teacher/processfiles/${pid}/types/${auth}`
    )
    return resp.data.data?.processFiles as unknown as Ref<ProcessFile[]>
  }

  // 获取未选择导师学生列表
  static getUnselectedStudentsService = async () => {
    const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/unselected')
    const students = resp.data.data?.students ?? []
    return students
  }

  // 获取全部学生。用于生成表格
  @StoreCache(usersStore.allStudentsS)
  static async getStudentsService() {
    const resp = await axios.get<ResultVO<{ students: User[] }>>('teacher/students')
    return resp.data.data?.students as unknown as Ref<User[]>
  }
  // 获取全部教师
  @StoreCache(usersStore.allTeachersS)
  static async getTeachersService() {
    const resp = await axios.get<ResultVO<{ teachers: User[] }>>('teacher/teachers')
    return resp.data.data?.teachers as unknown as Ref<User[]>
  }

  // 获取全部学生评分
  @StoreCache(processInfosStore.allProcessScoresS)
  static async getAllProcessScoresService() {
    const resp =
      await axios.get<ResultVO<{ processScores: ProcessScore[] }>>('teacher/processscores')
    return resp.data.data?.processScores as unknown as Ref<ProcessScore[]>
  }

  //
  static getProcessFileService = async (name: string) => {
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

  // 加载小组全部评分
  @StoreCache(processInfosStore.groupProcessScoresS)
  static async listProcessScoresGroupService() {
    const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>(
      'teacher/processscores/groups'
    )
    return resp.data.data?.processScores as unknown as Ref<ProcessScore[]>
  }

  //
  static resetPasswordService = async (number: string) => {
    const resp = await axios.put<ResultVO<{ number: number }>>(`teacher/passwords/${number}`)
    return resp.data.data?.number
  }
}
