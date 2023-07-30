<script lang="ts" setup>
import { Setting, Lock, Delete } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/UserStore'
import { useSettingStore } from '@/stores/SettingStore'

const store = useUserStore()
const settingStore = useSettingStore()

const user = storeToRefs(store).userS

const showResetPassword = () => (settingStore.showResetPasswordS = true)

const logout = () => {
  sessionStorage.clear()
  window.location.href = '/'
}
</script>
<template>
  <el-button
    type="danger"
    :icon="Setting"
    @click="settingStore.showSettingS = true"
    style="margin: 10px">
    {{ user?.name }}
  </el-button>

  <el-dialog v-model="settingStore.showSettingS" title="Setting" width="15%" center>
    <div style="text-align: center">
      <el-button type="danger" :icon="Lock" @click="showResetPassword"></el-button>
      <br />
      <br />
      <el-button type="danger" :icon="Delete" @click="logout"></el-button>
    </div>
  </el-dialog>
</template>
