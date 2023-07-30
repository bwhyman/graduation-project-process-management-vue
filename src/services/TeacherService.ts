import axios from '@/axios'
import { useUserStore } from '@/stores/UserStore'
import type {
  PSDetail,
  PSDetailTeacher,
  ProcessFile,
  ProcessScore,
  ResultVO,
  Student,
  User
} from '@/types/type'
import { useGroupStudentsStore } from '@/stores/GroupInfosStore'
import { usePSDetailsStore } from '@/stores/PSDetailsStore'
import { parseStudents, parseTeachers } from './ParseUtils'
import { PA_TUTOR } from './Const'

// 加载指导学生/组学生/组评审，信息
export const getInfosService = async () => {
  const groupStore = useGroupStudentsStore()
  const gstudentsR = storeToRefs(groupStore).groupStudentsS
  const gteachersR = storeToRefs(groupStore).groupTeachersS
  const tutortudentsR = storeToRefs(groupStore).tutortudentsS

  const resp = await axios.get<
    ResultVO<{ students: User[]; teachers: User[]; tutorStudents: User[] }>
  >(`teacher/infos`)
  const stus = resp.data.data?.students
  const teas = resp.data.data?.teachers
  const tutorStus = resp.data.data?.tutorStudents

  stus && parseStudents(stus) && (gstudentsR.value = parseStudents(stus))
  teas && parseTeachers(teas) && (gteachersR.value = parseTeachers(teas))
  tutorStus && parseStudents(tutorStus) && (tutortudentsR.value = parseStudents(tutorStus))
  // 学生按答辩顺序排序
  gstudentsR.value.sort((x, y) => (x.queueNumber ?? 0) - (y.queueNumber ?? 0))
}

//
export const listProcessScoresService = async (pid: string, auth: string) => {
  const psDetailsStore = usePSDetailsStore()
  const psDetailsMap = storeToRefs(psDetailsStore).psDetailsMap
  const psDetails = psDetailsMap.value.get(pid)
  if (psDetails) return

  const useStore = useUserStore()
  const group = useStore.userS.groupNumber
  const groupStore = useGroupStudentsStore()
  const gstudentsR = storeToRefs(groupStore).groupStudentsS
  const tutorstudentR = storeToRefs(groupStore).tutortudentsS
  const watchGroupStudents = watch(
    [gstudentsR, tutorstudentR],
    async () => {
      if (gstudentsR.value.length > 0) {
        const resp = await axios.get<ResultVO<{ processScores: ProcessScore[] }>>(
          `teacher/processes/${pid}/group/${group}`
        )
        const processScores = resp.data.data?.processScores
        const stus = auth == PA_TUTOR ? tutorstudentR.value : gstudentsR.value
        const psDetails = collectPSDetails(processScores ?? [], stus)
        psDetailsMap.value.set(pid, psDetails)
        // 停止监听
        watchGroupStudents()
      }
    },
    { immediate: true }
  )
}

//
export const addPorcessScore = async (ps: {
  score: number
  processId: string
  studentId: string
}) => {
  const resp = await axios.post<ResultVO<{ processScores: ProcessScore[] }>>(
    'teacher/processscores',
    ps
  )
  const groupStore = useGroupStudentsStore()
  const gStudentsR = storeToRefs(groupStore).groupStudentsS

  const processScores = resp.data.data?.processScores
  const details = collectPSDetails(processScores ?? [], gStudentsR.value ?? [])

  const psDetailsStore = usePSDetailsStore()
  const psDetailsMap = storeToRefs(psDetailsStore).psDetailsMap
  psDetailsMap.value.set(ps.processId, details)
}

//
const collectPSDetails = (processScores: ProcessScore[], gStudents: Student[]) => {
  const psDetails: PSDetail[] = []
  gStudents?.forEach((stu) => {
    const psd: PSDetail = {
      name: stu.name,
      studentId: stu.id,
      teacherName: stu.teacherName,
      projectTitle: stu.projectTitle,
      teachers: [],
      score: 0
    }

    processScores?.forEach((ps) => {
      if (ps.studentId == stu.id) {
        const detail = JSON.parse(ps.detail as string) as PSDetailTeacher[]
        let scoreTemp = 0
        detail.forEach((d) => {
          scoreTemp += d.score
          psd.teachers?.push({ teacherId: d.teacherId, score: d.score, teacherName: d.teacherName })
        })

        if (psd.teachers) {
          psd.score = scoreTemp / psd.teachers?.length
        }
      }
    })

    psd.score = ~~((psd.score ?? 0) * 100) / 100
    psDetails.push(psd)
  })

  return psDetails
}

export const listPorcessFilesService = async (pid: string) => {
  const useStore = useUserStore()
  const group = useStore.userS.groupNumber
  const resp = await axios.get<ResultVO<{ processFiles: ProcessFile[] }>>(
    `teacher/processfiles/${pid}/group/${group}`
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
