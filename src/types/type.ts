export interface User {
  id?: string
  name?: string
  number?: string
  password?: string
  groupNumber?: number
  student?: string | Student
  teacher?: string | Teacher
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
  count?: number
}

export interface Process {
  id?: string
  name?: string
  auth?: string
  point?: number
  studentAttach?: StudentProcess[] | string
  items?: ProcessItem[] | string
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
  studentId: string
  detail: string
  processId: string
  score?: number
}

export interface PSDetail {
  name?: string
  teacherName?: string
  studentId?: string
  projectTitle?: string
  score?: number
  teachers?: PSDetailTeacher[]
}

export interface PSDetailTeacher {
  teacherId: string
  score: number
  teacherName: string
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
