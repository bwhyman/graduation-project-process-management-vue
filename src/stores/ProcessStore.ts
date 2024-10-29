import type { Process, StudentAttach } from '@/types'

const processesS = shallowRef<Process[]>()
const studentProcessesS = shallowRef<StudentAttach[]>()
const store = { processesS, studentProcessesS }
export const useProcessStore = () => {
  return store
}
