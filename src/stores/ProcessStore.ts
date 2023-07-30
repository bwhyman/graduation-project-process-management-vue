import type { Process, StudentProcess } from '@/types/type'
import { defineStore } from 'pinia'

export const useProcessStore = defineStore('useProcessStore', () => {
  const processesS = ref<Process[]>([])
  const studentProcessesS = ref<StudentProcess[]>([])

  return { processesS, studentProcessesS }
})
