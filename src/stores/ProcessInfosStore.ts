import type { ProcessFile, ProcessScore } from '@/types'

const porcessFilesS = ref<ProcessFile[]>()
const processScoresS = ref<ProcessScore[]>()
const allProcessScoresS = ref<ProcessScore[]>()
const groupProcessScoresS = ref<ProcessScore[]>()
const clear = () => {
  groupProcessScoresS.value = undefined
  processScoresS.value = undefined
  allProcessScoresS.value = undefined
}
const store = { processScoresS, allProcessScoresS, porcessFilesS, groupProcessScoresS, clear }

export const useProcessInfosStore = () => store
