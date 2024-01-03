import type { Process, StudentAttach } from '@/types'
import { defineStore } from 'pinia'

export const useProcessStore = defineStore('useProcessStore', () => {
  const processesS = ref<Process[]>([])
  const studentProcessesS = ref<StudentAttach[]>([])

  return { processesS, studentProcessesS }
})
