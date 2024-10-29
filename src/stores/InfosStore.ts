import type { Student, Teacher } from '@/types'

// 基于过程分组学生
const groupStudentsS = shallowRef<Student[]>()
const groupTeachersS = shallowRef<Teacher[]>()
const tutortudentsS = shallowRef<Student[]>()
const clear = () => {
  groupStudentsS.value = undefined
  groupTeachersS.value = undefined
  tutortudentsS.value = undefined
}
const store = { groupStudentsS, groupTeachersS, tutortudentsS, clear }
export const useInfosStore = () => {
  return store
}
