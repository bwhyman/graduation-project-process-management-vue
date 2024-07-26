<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { readProjectTitles } from '@/services/ExcelUtils'
import type { User } from '@/types'
import { Check } from '@element-plus/icons-vue'

const projects = ref<User[]>([])
const readProjects = (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readProjectTitles(element.files[0]).then((ts: User[]) => {
    projects.value = ts
  })
}

const add = async () => {
  //await AdminService.addProjectTitles(projects.value)
  createElNotificationSuccess('题目导入成功')
}
</script>
<template>
  读取题目表格：
  <input type="file" @change="readProjects" />
  <el-button type="success" :icon="Check" :disabled="projects.length == 0" @click="add"></el-button>
  <br />
  {{ projects[0] }} / {{ projects?.length }}
</template>
