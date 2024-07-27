<script setup lang="ts">
import { createElLoading } from '@/components/loading'
import { createElNotificationSuccess } from '@/components/message'
import { readStudentsAllInfo } from '@/services/ExcelUtils'
import { TeacherService } from '@/services/TeacherService'
import type { User } from '@/types'
const allStudentsR = ref<User[]>([])

const readStu = async (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readStudentsAllInfo(element.files![0]).then((students) => {
    allStudentsR.value = students
  })

  element.value = ''
}
// ----------------
const submitF = async () => {
  const loading = createElLoading()
  const students = await TeacherService.listStudentsService()
  allStudentsR.value.forEach((stu) => {
    // 取出原student中属性值
    const oldStu = students.value.find((s) => s.number === stu.number)
    stu.student = {
      ...oldStu?.student,
      ...stu.student
    }
  })

  await TeacherService.updateStudentsService(allStudentsR.value)
  loading.close()
  allStudentsR.value = []
  createElNotificationSuccess('学生导入成功')
}
</script>
<template>
  <el-row class="my-row">
    <el-col class="my-col">读取并覆盖，包含顺序/分组/题目的学生表格：</el-col>
    <el-col class="my-col" :span="6">
      <input type="file" @change="readStu" />
    </el-col>
    <el-col :span="2">
      <el-button type="success" v-if="allStudentsR.length > 0" @click="submitF">导入</el-button>
    </el-col>
    <el-col class="my-col">
      {{ allStudentsR[0] }}
    </el-col>
  </el-row>
</template>
