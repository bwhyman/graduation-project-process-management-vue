<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import type { Student } from '@/types/type'
import { readStudentFile } from '@/services/ExcelUtils'
import { addStudents } from '@/services/AdminService'

const students = ref<Student[]>([])
// read student excel
const readStu = (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readStudentFile(element.files[0]).then((sts: Student[]) => {
    students.value = sts
  })
}

const submitStudents = () => {
  addStudents(students.value)
  students.value = []
}
</script>
<template>
  读取学生表格：
  <input type="file" @change="readStu" />
  <el-button
    type="success"
    :icon="Check"
    :disabled="students.length == 0"
    @click="submitStudents"></el-button>
  <br />
  {{ students[0] }} / {{ students?.length }}
</template>
