<script setup lang="ts">
import { getStudentsService } from '@/services/TeacherService'

const exportStudents = () => {
  getStudentsService().then((res) => {
    if (!res) return
    let i = 0
    let result = res.map((s) => {
      return {
        序号: (i += 1),
        学号: s.number,
        学生姓名: s.name,
        指导教师: s.student?.teacherName
      }
    })
    import('@/services/ExcelUtils').then(({ exportExcelFile }) => exportExcelFile(result))
  })
}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-button type="primary" @click="exportStudents">导出互选表格</el-button>
    </el-col>
  </el-row>
</template>
