<script setup lang="ts">
import { CommonService } from '@/services'
import { TeacherService } from '@/services/TeacherService'

const exportScores = async () => {
  const result = await Promise.all([
    TeacherService.listStudentsService(),
    TeacherService.getAllProcessScoresService(),
    CommonService.listProcessesService()
  ])

  const students = result[0]
  const processScores = result[1]
  const processesS = result[2]

  import('@/services/ExcelUtils').then(({ exportScoreExcelFile }) =>
    exportScoreExcelFile(processesS.value, processScores.value, students.value)
  )
}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-button type="primary" @click="exportScores">导出详细成绩表格</el-button>
    </el-col>
  </el-row>
</template>
