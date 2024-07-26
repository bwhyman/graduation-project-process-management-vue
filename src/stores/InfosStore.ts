import type { Student, Teacher } from '@/types'

// 基于过程分组学生
const groupStudentsS = ref<Student[]>([])
const groupTeachersS = ref<Teacher[]>([])
const tutortudentsS = ref<Student[]>([])
const clear = () => {
  groupStudentsS.value = []
  groupTeachersS.value = []
  tutortudentsS.value = []
}
const store = { groupStudentsS, groupTeachersS, tutortudentsS, clear }
export const useInfosStore = () => {
  return store
}
