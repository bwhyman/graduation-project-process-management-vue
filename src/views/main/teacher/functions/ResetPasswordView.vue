<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import { updatePassword } from '@/services/TeacherService'
import { createElNotificationSuccess } from '@/components/message'

// reset password
const numberR = ref<string>()
let resetpassword = async () => {
  numberR.value && (await updatePassword(numberR.value))
  numberR.value = ''
  createElNotificationSuccess('密码重置成功')
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
