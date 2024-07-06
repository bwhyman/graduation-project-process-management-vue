<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import { TeacherService } from '@/services/TeacherService'
import { createElNotificationSuccess, createMessageDialog } from '@/components/message'

// reset password
const numberR = ref<string>()
let resetpassword = async () => {
  const account = numberR.value
  if (!account) {
    createMessageDialog('重置账号为空')
    return
  }
  const num = await TeacherService.resetPasswordService(account)
  if (num == 1) {
    createElNotificationSuccess('密码重置成功')
    numberR.value = undefined
    return
  }
  createMessageDialog('重置账号失败，请确认账号存在')
}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <p>重置密码为学号/工号。</p>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="numberR" placeholder="重置账号密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            :icon="Check"
            @click="resetpassword"
            :disabled="!numberR"></el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
