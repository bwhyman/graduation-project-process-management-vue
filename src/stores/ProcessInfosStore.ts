import type { ProcessFile, ProcessScore } from '@/types'

const porcessFilesMapS = shallowRef<Map<string, ProcessFile[]>>(new Map())
const processScoresMapS = shallowRef<Map<string, ProcessScore[]>>(new Map())
const allProcessScoresS = shallowRef<ProcessScore[]>()
const groupProcessScoresS = shallowRef<ProcessScore[]>()
const clear = () => {
  groupProcessScoresS.value = undefined
  processScoresMapS.value.clear()
  allProcessScoresS.value = undefined
}
const store = { processScoresMapS, allProcessScoresS, porcessFilesMapS, groupProcessScoresS, clear }

export const useProcessInfosStore = () => store
