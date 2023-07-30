import type { PSDetail } from '@/types/type'
/**
 * 已过程ID为键，详细评分为值
 */
export const usePSDetailsStore = defineStore('usePSDetailsStore', () => {
  const psDetailsMap = ref(new Map<string, PSDetail[]>())
  return { psDetailsMap }
})
