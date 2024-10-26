import type { ProcessFile, ProcessScore } from '@/types'

const porcessFilesMapS = ref<Map<string, ProcessFile[]>>(new Map())
const processScoresMapS = ref<Map<string, ProcessScore[]>>(new Map())
const allProcessScoresS = ref<ProcessScore[]>()
const groupProcessScoresS = ref<ProcessScore[]>()
const clear = () => {
  groupProcessScoresS.value = undefined
  processScoresMapS.value.clear()
  allProcessScoresS.value = undefined
}
const store = { processScoresMapS, allProcessScoresS, porcessFilesMapS, groupProcessScoresS, clear }

export const useProcessInfosStore = () => store
