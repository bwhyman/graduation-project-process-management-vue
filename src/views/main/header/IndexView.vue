<script lang="ts" setup>
import { Refresh, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/UserStore'
const user = storeToRefs(useUserStore()).userS
const refreshF = () => location.reload()
</script>
<template>
  <el-row class="my-row" style="padding: 3px" align="middle">
    <el-col :span="4">
      <el-button
        type="danger"
        :icon="Setting"
        @click="$router.push('/settings')"
        style="margin: 10px">
        {{ user?.name }}
      </el-button>
    </el-col>

    <!-- 基于权限加载上功能栏 -->
    <el-col :span="18">
      <RouterView name="menu" />
    </el-col>
    <el-col :span="2">
      <el-icon id="refresh" :size="32" color="red" @click="refreshF">
        <Refresh />
      </el-icon>
    </el-col>
  </el-row>
</template>
<style scoped>
#refresh :hover {
  cursor: pointer;
}
</style>
