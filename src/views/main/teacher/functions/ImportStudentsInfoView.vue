<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { readStudentsProjects } from '@/services/ExcelUtils'
import { TeacherService } from '@/services/TeacherService'
import type { StudentDTO } from '@/types'

const studentsProjectsR = ref<StudentDTO[]>([])

const readStu = async (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readStudentsProjects(element.files![0]).then((students) => {
    studentsProjectsR.value = students
  })

  element.value = ''
}

// ----------------
const submitF = async () => {
  await TeacherService.updateStudentsProjectsService(studentsProjectsR.value)
  studentsProjectsR.value = []
  createElNotificationSuccess('学生题目导入成功')
}
</script>
<template>
  <el-row class="my-row">
    <el-col class="my-col">按模板，读取学生毕设题目：`#, 账号，题目`</el-col>
    <el-col class="my-col" :span="6">
      <input type="file" @change="readStu" />
    </el-col>
    <el-col :span="2">
      <el-button type="success" v-if="studentsProjectsR.length > 0" @click="submitF">
        导入
      </el-button>
    </el-col>
    <el-col class="my-col">
      {{ studentsProjectsR[0] }}
    </el-col>
  </el-row>
</template>
