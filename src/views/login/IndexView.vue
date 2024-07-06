<script lang="ts" setup>
import type { User } from '@/types'
import { Lock, User as UserIco, SwitchButton } from '@element-plus/icons-vue'
import { CommonService } from '@/services'

let user = ref<User>({})

let login = () => {
  let number = user.value.number
  let password = user.value.password
  CommonService.loginService({
    number: number,
    password: password
  })
  user.value.number = ''
  user.value.password = ''
}
</script>

<template>
  <el-row>
    <el-col :span="12" :offset="6" style="margin-top: 15px" @keyup.enter="login">
      <el-card class="box-card">
        <div style="margin-bottom: 15px">
          <el-input
            v-model="user.number"
            placeholder="账号"
            :prefix-icon="UserIco"
            style="margin-bottom: 10px" />
          <el-input
            type="password"
            v-model="user.password"
            placeholder="密码"
            :prefix-icon="Lock" />
        </div>
        <el-button type="primary" @click="login" :disabled="!user.number || !user.password">
          <el-icon><SwitchButton /></el-icon>
        </el-button>
      </el-card>
    </el-col>
  </el-row>
</template>
