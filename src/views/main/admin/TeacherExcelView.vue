<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import type { User } from '@/types'
import { readTeacherFile } from '@/services/ExcelUtils'
import { addTeachers } from '@/services/AdminService'

const teachers = ref<User[]>([])
// read teacher excel
const readTeacher = (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readTeacherFile(element.files[0]).then((ts: User[]) => {
    teachers.value = ts
  })
}

const submitTeachers = () => {
  addTeachers(teachers.value)
  teachers.value = []
}
</script>
<template>
  读取导师表格：
  <input type="file" @change="readTeacher" />
  <el-button
    type="success"
    :icon="Check"
    :disabled="teachers.length == 0"
    @click="submitTeachers"></el-button>
  <br />
  {{ teachers[0] }} / {{ teachers?.length }}
</template>
