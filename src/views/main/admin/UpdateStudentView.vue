<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import type { Student } from '@/types'
import { readStudents2 } from '@/services/ExcelUtils'
import { addStudentsAll } from '@/services/AdminService'
import { createElNotificationSuccess } from '@/components/message'

const students = ref<Student[]>([])
// read student excel
const readStu = (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readStudents2(element.files[0]).then((sts: Student[]) => {
    students.value = sts
    console.log(sts)
  })
}

const submitStudents = async () => {
  await addStudentsAll(students.value)
  createElNotificationSuccess('更新学生成功')
  students.value = []
}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      读取包含顺序/学号/分组/题目的表格，用于覆盖：
      <input type="file" @change="readStu" />
      <el-button
        type="success"
        :icon="Check"
        :disabled="students.length == 0"
        @click="submitStudents"></el-button>
      <br />
      {{ students[0] }} / {{ students?.length }}
    </el-col>
  </el-row>
</template>
