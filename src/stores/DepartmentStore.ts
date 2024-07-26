import type { Department } from '@/types'

const departmentsS = ref<Department[]>([])
const clear = () => (departmentsS.value = [])
const store = { departmentsS, clear }

export const useDepartmentStore = () => store
