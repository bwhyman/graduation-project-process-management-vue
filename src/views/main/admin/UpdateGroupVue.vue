<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'

import type { User } from '@/types'
import { Check } from '@element-plus/icons-vue'
import FindUserVue from './finduser/FindUserVue.vue'
import { updateUserGroupService } from '@/services/AdminService'

const findUserVueR = ref<{ user: User }>()
const groupR = ref(0)
onMounted(() => {
  watchEffect(async () => {
    const user = findUserVueR.value?.user
    if (user) {
      groupR.value = user?.groupNumber ?? 0
    }
  })
})
const updateGroupF = async () => {
  const user: User = { number: findUserVueR.value?.user.number, groupNumber: groupR.value }
  await updateUserGroupService(user)
  createElNotificationSuccess('更新组成功')
  findUserVueR.value && (findUserVueR.value.user = {})
  groupR.value = 0
}
</script>
<template>
  <el-row class="my-row" :gutter="10">
    <el-col :span="24" class="my-col">更新学生/教师答辩组。</el-col>
    <FindUserVue ref="findUserVueR" />
    <el-col :span="6" v-if="findUserVueR?.user" class="my-col">
      <el-input v-model.number="groupR" placeholder="组" type="number" />
    </el-col>
    <el-col :span="6">
      <el-button v-if="groupR != 0" type="success" @click="updateGroupF" :icon="Check"></el-button>
    </el-col>
  </el-row>
</template>
