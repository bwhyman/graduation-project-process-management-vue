<script lang="ts" setup>
import { CommonService } from '@/services'
import type { User } from '@/types'
import { Lock, SwitchButton, User as UserIco } from '@element-plus/icons-vue'

let user = ref<User>({})

let login = async () => {
  let number = user.value.number
  let password = user.value.password
  await CommonService.loginService({
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
        <el-text type="danger" style="margin-left: 10px">默认账号密码均为学号</el-text>
      </el-card>
    </el-col>
  </el-row>
</template>
