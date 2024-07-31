import type { Department } from '@/types'

const departmentsS = ref<Department[]>()
const clear = () => (departmentsS.value = undefined)
const store = { departmentsS, clear }

export const useDepartmentStore = () => store
