import type { Process, StudentAttach } from '@/types'

const processesS = ref<Process[]>([])
const studentProcessesS = ref<StudentAttach[]>([])
export const useProcessStore = () => {
  return { processesS, studentProcessesS }
}
