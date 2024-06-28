import type { Process, StudentAttach } from '@/types'

export const useProcessStore = () => {
  const processesS = ref<Process[]>([])
  const studentProcessesS = ref<StudentAttach[]>([])

  return { processesS, studentProcessesS }
}
