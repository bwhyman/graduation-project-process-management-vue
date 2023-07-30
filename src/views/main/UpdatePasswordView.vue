<script lang="ts" setup>
import { updateSelfPassword } from '@/services'
import { useMessageStore } from '@/stores/MessageStore'
import { Lock } from '@element-plus/icons-vue'
import { useSettingStore } from '@/stores/SettingStore'

const messageStore = useMessageStore()

const settingStore = useSettingStore()

const pwdM = ref({ p1: '', p2: '' })

const resetPwd = () => {
  if (!pwdM.value.p1 || !(pwdM.value.p1 == pwdM.value.p2)) {
    messageStore.messageS = '2次输入密码不同'
    return
  }
  updateSelfPassword(pwdM.value.p1)
  pwdM.value.p2 = pwdM.value.p1 = ''
  settingStore.showResetPasswordS = false
  settingStore.showSettingS = false
}
const close = () => {
  settingStore.showResetPasswordS = false
  settingStore.showSettingS = false
}
</script>

<template>
  <el-dialog title="建议修改默认密码" @close="close" v-model="settingStore.showResetPasswordS">
    <div style="margin-bottom: 15px">
      <el-input
        type="password"
        v-model="pwdM.p1"
        placeholder="password"
        :prefix-icon="Lock"
        style="margin-bottom: 10px" />
      <el-input type="password" v-model="pwdM.p2" placeholder="re-enter" :prefix-icon="Lock" />
    </div>
    <el-button type="primary" @click="resetPwd" :disabled="!pwdM.p2 || !pwdM.p1">Reset</el-button>
  </el-dialog>
</template>
