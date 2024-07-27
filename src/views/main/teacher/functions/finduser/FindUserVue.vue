<script setup lang="ts">
import { TeacherService } from '@/services/TeacherService'
import type { User } from '@/types'
import { Search } from '@element-plus/icons-vue'

const accountR = ref()
const userR = ref<User>()
const getUserF = async () => {
  const account = accountR.value
  accountR.value = ''
  const user = await TeacherService.getStudentService(account)
  if (!user) {
    throw '未找到该账号用户'
  }
  userR.value = user
}
defineExpose({ user: userR })
</script>
<template>
  <div>
    <el-input style="width: 240px; margin-right: 10px" v-model="accountR" placeholder="账号" />
    <el-button type="success" @click="getUserF" :icon="Search" :disabled="!accountR"></el-button>
  </div>
</template>
