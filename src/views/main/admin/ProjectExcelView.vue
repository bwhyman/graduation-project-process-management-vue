<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import type { User } from '@/types/type'
import { readProjectTitles } from '@/services/ExcelUtils'
import { addProjectTitles } from '@/services/AdminService'

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

const add = () => {
  addProjectTitles(projects.value)
}
</script>
<template>
  读取题目表格：
  <input type="file" @change="readProjects" />
  <el-button type="success" :icon="Check" :disabled="projects.length == 0" @click="add"></el-button>
  <br />
  {{ projects[0] }} / {{ projects?.length }}
</template>
