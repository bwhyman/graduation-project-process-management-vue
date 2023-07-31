import type { Process, ProcessScore, Student, Teacher, User } from '@/types/type'
// =====  反序列化     =========
export const parseStudents = (students: User[]) => {
  const stus = students as Student[]
  stus?.forEach((stu) => {
    if (!stu.student) return
    const sParse = JSON.parse(stu.student as string)
    stu.teacherName = sParse.teacherName
    stu.projectTitle = sParse.projectTitle
    stu.queueNumber = sParse.queueNumber
    stu.teacherId = sParse.teacherId
    stu.student = undefined
  })
  return stus
}

export const parseStudent = (student: User) => {
  const stu = student as Student
  if (student.student) {
    const sParse = JSON.parse(student.student as string)
    stu.teacherName = sParse.teacherName
    stu.projectTitle = sParse.projectTitle
    stu.queueNumber = sParse.queueNumber
    stu.teacherId = sParse.teacherId
    stu.student = undefined
  }
  return stu
}

export const parseTeachers = (teachers: User[]) => {
  const teachs = teachers as Teacher[]
  teachs?.forEach((tea) => {
    if (!tea.teacher) return
    const tP = JSON.parse(tea.teacher as string)
    tea.total = tP.total
    tea.count = tP.count
    tea.teacher = undefined
  })
  return teachs
}
export const parseTeacher = (teacher: User) => {
  const teach = teacher as Teacher
  if (teacher.teacher) {
    const tP = JSON.parse(teacher.teacher as string)
    teach.count = tP.count
    teach.total = tP.total
    teach.teacher = undefined
  }

  return teach
}

export const parseProcesses = (processes: Process[]) => {
  processes.forEach((ps) => {
    ps.items && (ps.items = JSON.parse(ps.items as string))
    ps.studentAttach && (ps.studentAttach = JSON.parse(ps.studentAttach as string))
  })
  return processes
}

export const parseProcessScores = (pses: ProcessScore[]) => {
  pses.forEach((ps) => {
    ps.detail && (ps.detail = JSON.parse(ps.detail as string))
  })
  return pses
}
