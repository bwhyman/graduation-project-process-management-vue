import type { Department } from '@/types'

const departmentsS = shallowRef<Department[]>()
const clear = () => (departmentsS.value = undefined)
const store = { departmentsS, clear }

export const useDepartmentStore = () => store
