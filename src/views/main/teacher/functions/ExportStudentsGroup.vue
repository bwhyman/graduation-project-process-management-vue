<script setup lang="ts">
import { TeacherService } from '@/services/TeacherService'
import type { Student, User } from '@/types'

const exportGroup = async () => {
  const students = await TeacherService.getStudentsService()
  const teachers = await TeacherService.getTeachersService()
  const map = new Map<number, { students: Student[]; teachers: User[] }>()
  students.value.forEach((stu) => {
    if (!stu.groupNumber) return
    let mapValue = stu.groupNumber && map.get(stu.groupNumber)
    if (!mapValue) {
      mapValue = { students: [], teachers: [] }
      map.set(stu.groupNumber, mapValue)
    }
    mapValue.students.push(stu)
  })

  teachers.value.forEach((ts) => {
    if (!ts.groupNumber) return
    let mapValue = ts.groupNumber && map.get(ts.groupNumber)
    if (!mapValue) {
      mapValue = { students: [], teachers: [] }
      map.set(ts.groupNumber, mapValue)
    }
    mapValue.teachers.push(ts)
  })

  map.forEach((value) => {
    value.students.sort((s1, s2) => s1.queueNumber! - s2.queueNumber!)
  })

  import('@/services/ExcelUtils').then(({ exportGroupExcelFile }) => exportGroupExcelFile(map))
}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-button type="primary" @click="exportGroup">导出分组表格</el-button>
    </el-col>
  </el-row>
</template>
