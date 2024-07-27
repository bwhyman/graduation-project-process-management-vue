import type { User } from '@/types'

export const exportGroup = async (students: User[]) => {
  const map = new Map<number, User[]>()
  students.forEach((stu) => {
    if (!stu.groupNumber) return
    let mapValue = stu.groupNumber && map.get(stu.groupNumber)
    if (!mapValue) {
      mapValue = []
      map.set(stu.groupNumber, mapValue)
    }
    mapValue.push(stu)
  })
  map.forEach((value) => {
    value.sort((s1, s2) => s1.student?.queueNumber! - s2.student?.queueNumber!)
  })
  // 按组排序
  const sortedAsc = new Map([...map].sort())
  import('@/services/ExcelUtils').then(({ exportGroupExcelFile }) =>
    exportGroupExcelFile(sortedAsc)
  )
}
