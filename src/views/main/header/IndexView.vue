<script lang="ts" setup>
import { SwitchButton, Setting } from '@element-plus/icons-vue'
import router from '@/router'
import { getStoreUserService } from '@/services'
const userS = getStoreUserService()
const logoutF = () => {
  sessionStorage.clear()
  router.push('/login')
}
</script>
<template>
  <el-row class="my-row" style="padding: 3px" align="middle">
    <el-col :span="4">
      <el-button
        type="danger"
        :icon="Setting"
        @click="$router.push('/settings')"
        style="margin: 10px">
        {{ userS?.name }}
      </el-button>
    </el-col>

    <!-- 基于权限加载上功能栏 -->
    <el-col :span="18">
      <RouterView name="menu" />
    </el-col>
    <el-col :span="2">
      <el-icon id="logout" :size="32" color="red" @click="logoutF">
        <SwitchButton />
      </el-icon>
    </el-col>
  </el-row>
</template>
<style scoped>
#logout :hover {
  cursor: pointer;
}
</style>
