import type { ProcessFile, ProcessScore } from '@/types'

const porcessFilesS = ref<ProcessFile[]>([])
const processScoresS = ref<ProcessScore[]>([])
const allProcessScoresS = ref<ProcessScore[]>([])
const groupProcessScoresS = ref<ProcessScore[]>([])
const clear = () => (processScoresS.value = [])
const store = { processScoresS, allProcessScoresS, porcessFilesS, groupProcessScoresS, clear }

export const useProcessInfosStore = () => store
