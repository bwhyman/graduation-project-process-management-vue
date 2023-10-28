export interface User {
  id?: string
  name?: string
  number?: string
  password?: string
  groupNumber?: number
  student?: Student
  teacher?: Teacher
  insertTime?: string
  updateTime?: string
}
export interface Student extends User {
  teacherId?: string
  teacherName?: string
  queueNumber?: number
  projectTitle?: string
}

export interface Teacher extends User {
  total?: number
  A?: number
  B?: number
  C?: number
}

export interface TeacherABC extends User {
  total?: number
  A?: number
  B?: number
  C?: number
}

export interface Process {
  id?: string
  name?: string
  auth?: string
  point?: number
  studentAttach?: StudentProcess[]
  items?: ProcessItem[]
}

export interface StudentProcess {
  processId?: string
  name?: string
  ext?: string
}

export interface ProcessItem {
  number?: number
  name?: string
  point?: number
  description?: string
}

export interface ProcessScore {
  id?: string
  studentId?: string
  teacherId?: string
  processId?: string
  detail?: PSDetail
}

export interface PSDetail {
  teacherName?: string
  score?: number
  detail?: { number: number; score: number }[]
}

export interface PSDetailTeacher {
  processScoreId?: string
  teacherId?: string
  teacherName?: string
  score?: number
  detail?: { number: number; score: number }[]
}

export interface StudentProcessScore extends Student {
  averageScore?: number
  currentTeacherScore?: number
  psTeachers?: PSDetailTeacher[]
}

export interface ProcessFile {
  id?: string
  studentId?: string
  processId?: string
  detail?: string
}

export interface ResultVO<T> {
  code: number
  message?: string
  data?: T
}
