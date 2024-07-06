<script lang="ts" setup>
import { Lock } from '@element-plus/icons-vue'
import { CommonService } from '@/services'
import { createElNotificationSuccess, createMessageDialog } from '@/components/message'

const pwdM = ref({ p1: '', p2: '' })
const resetPwd = async () => {
  if (!pwdM.value.p1 || !(pwdM.value.p1 == pwdM.value.p2)) {
    createMessageDialog('2次输入密码不同')
    return
  }
  await CommonService.updateSelfPassword(pwdM.value.p1)
  createElNotificationSuccess('密码更新成功')
  pwdM.value.p2 = pwdM.value.p1 = ''
}
</script>
<template>
  <el-row class="my-row">
    <el-col style="margin-bottom: 10px">建议修改默认密码</el-col>
    <el-col :span="8" style="margin-bottom: 10px">
      <el-input
        type="password"
        v-model="pwdM.p1"
        placeholder="password"
        :prefix-icon="Lock"
        style="margin-bottom: 10px" />
      <el-input type="password" v-model="pwdM.p2" placeholder="re-enter" :prefix-icon="Lock" />
    </el-col>
    <el-col>
      <el-button type="success" @click="resetPwd" :disabled="!pwdM.p2 || !pwdM.p1">提交</el-button>
    </el-col>
  </el-row>
</template>
