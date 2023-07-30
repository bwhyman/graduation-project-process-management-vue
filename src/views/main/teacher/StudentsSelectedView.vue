<script setup lang="ts">
import { exportExcelFile } from '@/services/ExcelUtils'
import { parseStudent } from '@/services/ParseUtils'
import { getStudentsService, getUnselectedStudentsService } from '@/services/TeacherService'
import type { User } from '@/types/type'

const studentsR = ref<User[]>([])
const showUnSelectedR = ref(false)

const getStu = () => {
  getUnselectedStudentsService().then((result) => {
    result.students && (studentsR.value = result.students)
    showUnSelectedR.value = true
  })
}
const exportStudents = () => {
  getStudentsService().then((res) => {
    if (!res.students) return
    let i = 0
    let result = res.students.map((s) => {
      let temp = parseStudent(s)
      return {
        序号: (i += 1),
        学号: temp.number,
        学生姓名: temp.name,
        指导教师: temp.teacherName
      }
    })
    exportExcelFile(result)
  })
}
</script>
<template>
  <div>
    <p style="margin-bottom: 10px">
      <el-button type="primary" @click="getStu">未选择学生</el-button>
      <el-button type="primary" @click="exportStudents">导出Excel表格</el-button>
    </p>

    <p v-if="showUnSelectedR">
      未选学生数:
      <el-tag type="danger">{{ studentsR.length }}</el-tag>
      <br />
      <span v-for="(st, index) in studentsR" :key="index">{{ st.name }};</span>
    </p>
  </div>
</template>
