<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import type { User } from '@/types'
import { readTeacherFile } from '@/services/ExcelUtils'
import { addTeachers } from '@/services/AdminService'
import { createElNotificationSuccess } from '@/components/message'

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

const submitTeachers = async () => {
  await addTeachers(teachers.value)
  teachers.value = []
  createElNotificationSuccess('导师添加成功')
}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      读取包含带学生成绩数量的导师表格：
      <input type="file" @change="readTeacher" />
      <el-button
        type="success"
        :icon="Check"
        :disabled="teachers.length == 0"
        @click="submitTeachers"></el-button>
      <br />
      {{ teachers[0] }} / {{ teachers?.length }}
    </el-col>
  </el-row>
</template>
