import type { Process, StudentAttach } from '@/types'

const processesS = ref<Process[]>([])
const studentProcessesS = ref<StudentAttach[]>([])
const store = { processesS, studentProcessesS }
export const useProcessStore = () => {
  return store
}
