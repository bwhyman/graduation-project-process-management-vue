import type {
  LevelCount,
  PSDetail,
  PSDetailTeacher,
  ProcessScore,
  StudentProcessScore,
  User
} from '@/types'

export const collectPS = (pses: ProcessScore[], students: User[], currentUser: User) => {
  const levelCount: LevelCount = {
    score_last: 0,
    score_60: 0,
    score_70: 0,
    score_80: 0,
    score_90: 0,
    len: students.length
  }
  const currentPStudents: StudentProcessScore[] = []
  students.forEach((student) => {
    const stuD: StudentProcessScore = {}
    stuD.student = JSON.parse(JSON.stringify(student))
    currentPStudents.push(stuD)
    let temp = 0
    stuD.psTeachers = []
    stuD.averageScore = temp

    const teacherPSs = pses.filter((ps) => ps.studentId == stuD.student?.id)
    if (!teacherPSs) return
    teacherPSs.forEach((ps) => {
      const psDetail = ps.detail as PSDetail
      psDetail.score && (temp += psDetail.score)
      const psTeacher: PSDetailTeacher = {
        processScoreId: ps.id,
        teacherId: ps.teacherId,
        teacherName: psDetail.teacherName,
        score: psDetail.score,
        detail: psDetail.detail
      }
      stuD.psTeachers?.push(psTeacher)
      if (!currentUser) return
      if (ps.teacherId == currentUser.id) {
        stuD.currentTeacherScore = psDetail.score
      }
    })
    stuD.psTeachers.length > 0 && (stuD.averageScore = temp / stuD.psTeachers.length)
    stuD.averageScore = Math.round(stuD.averageScore)

    if (stuD.averageScore >= 90) {
      levelCount.score_90++
    } else if (stuD.averageScore >= 80 && stuD.averageScore < 90) {
      levelCount.score_80++
    } else if (stuD.averageScore >= 70 && stuD.averageScore < 80) {
      levelCount.score_70++
    } else if (stuD.averageScore >= 60 && stuD.averageScore < 70) {
      levelCount.score_60++
    } else if (stuD.averageScore < 60) {
      levelCount.score_last++
    }
  })

  return { levelCount, currentPStudents }
}
