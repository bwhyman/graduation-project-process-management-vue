import type { Student, Teacher } from '@/types'

// 基于过程分组学生
const groupStudentsS = ref<Student[]>([])
const groupTeachersS = ref<Teacher[]>([])
const tutortudentsS = ref<Student[]>([])
export const useInfosStore = () => {
  return { groupStudentsS, groupTeachersS, tutortudentsS }
}
