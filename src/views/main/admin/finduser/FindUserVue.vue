<script setup lang="ts">
import { createMessageDialog } from '@/components/message'
import { getUserService } from '@/services/AdminService'
import type { User } from '@/types'
import { Search } from '@element-plus/icons-vue'

const accountR = ref()
const userR = ref<User>()
const getUserF = async () => {
  const account = accountR.value
  accountR.value = ''
  const user = await getUserService(account)
  if (!user) {
    createMessageDialog('未找到该账号用户')
    return
  }
  userR.value = user
}
defineExpose({ user: userR })
</script>
<template>
  <el-col :span="6" class="my-col">
    <el-input v-model="accountR" placeholder="账号" />
  </el-col>
  <el-col :span="6">
    <el-button type="success" @click="getUserF" :icon="Search" :disabled="!accountR"></el-button>
  </el-col>
  <el-col :span="6">
    {{ userR?.name }}
  </el-col>
  <el-col :span="6"></el-col>
</template>
