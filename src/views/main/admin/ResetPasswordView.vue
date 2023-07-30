<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import { updatePassword } from '@/services/AdminService'

// reset password
const numberR = ref<string>()
let resetpassword = () => {
  numberR.value && updatePassword(numberR.value)
  numberR.value = ''
}
</script>
<template>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
      <el-input v-model="numberR" placeholder="账号重置密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="success"
        :icon="Check"
        @click="resetpassword"
        :disabled="!numberR"></el-button>
    </el-form-item>
  </el-form>
</template>
