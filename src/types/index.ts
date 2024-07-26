export interface Department {
  id?: string
  name?: string
}
export interface User {
  id?: string
  name?: string
  number?: string
  password?: string
  groupNumber?: number
  student?: Student
  teacher?: Teacher
  departmentId?: string
  insertTime?: string
  updateTime?: string
}
export interface Student {
  teacherId?: string
  teacherName?: string
  queueNumber?: number
  projectTitle?: string
}

export interface Teacher {
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
  studentAttach?: StudentAttach[]
  items?: ProcessItem[]
  departmentId?: string
}

export interface StudentAttach {
  number?: number
  name?: string
  ext?: string
  description?: string
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

export interface StudentProcessScore {
  student?: User
  averageScore?: number
  currentTeacherScore?: number
  psTeachers?: PSDetailTeacher[]
}

export interface ProcessFile {
  id?: string
  studentId?: string
  processId?: string
  detail?: string
  number?: number
}

export interface LevelCount {
  score_90: number
  score_80: number
  score_70: number
  score_60: number
  score_last: number
  len: number
}
export interface Progress {
  percentage: number
  rate: number
  total: number
  loaded: number
  title: string
}
export interface ResultVO<T> {
  code: number
  message?: string
  data?: T
}
