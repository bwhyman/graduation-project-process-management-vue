import type { Student, Teacher } from '@/types/type'
import { defineStore } from 'pinia'

export const useGroupStudentsStore = defineStore('useGroupStudentsStore', () => {
  // 基于过程分组学生
  const groupStudentsS = ref<Student[]>([])
  const groupTeachersS = ref<Teacher[]>([])
  const tutortudentsS = ref<Student[]>([])
  return { groupStudentsS, groupTeachersS, tutortudentsS }
})
