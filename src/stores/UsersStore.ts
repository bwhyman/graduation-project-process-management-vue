import type { User } from '@/types'

const allStudentsS = ref<User[]>()
const allTeachersS = ref<User[]>()
const clear = () => {
  allStudentsS.value = undefined
  allTeachersS.value = undefined
}
const store = { allStudentsS, allTeachersS, clear }
export const useUsersStore = () => store
