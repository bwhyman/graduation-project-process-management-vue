<script setup lang="ts">
import { CommonService } from '@/services'
import HeaderView from './header/IndexView.vue'
// 加载过程信息
await CommonService.listProcessesService()
</script>
<template>
  <HeaderView />
  <RouterView />
</template>
