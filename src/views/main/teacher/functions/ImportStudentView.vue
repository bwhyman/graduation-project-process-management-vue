<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { readStudentForSelectionFile } from '@/services/ExcelUtils'
import { TeacherService } from '@/services/TeacherService'
import type { User } from '@/types'
const allStudentsR = ref<User[]>([])

const readStu = async (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readStudentForSelectionFile(element.files![0]).then((students) => {
    allStudentsR.value = students
  })

  element.value = ''
}

// ----------------
const submitF = async () => {
  await TeacherService.addStudentsService(allStudentsR.value)
  allStudentsR.value = []
  createElNotificationSuccess('学生导入成功')
}
</script>
<template>
  <el-row class="my-row">
    <el-col class="my-col" :span="6">
      读取学生表格：
      <input type="file" @change="readStu" />
    </el-col>
    <el-col :span="2">
      <el-button type="success" v-if="allStudentsR.length > 0" @click="submitF">导入</el-button>
    </el-col>
    <el-col :span="12">
      {{ allStudentsR[0] }}
    </el-col>
  </el-row>
</template>
