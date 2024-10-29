import type { User } from '@/types'

const allStudentsS = shallowRef<User[]>()
const allTeachersS = shallowRef<User[]>()
const clear = () => {
  allStudentsS.value = undefined
  allTeachersS.value = undefined
}
const store = { allStudentsS, allTeachersS, clear }
export const useUsersStore = () => store
