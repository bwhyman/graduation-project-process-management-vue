<script setup lang="ts">
import { listProcessesService } from '@/services'
import HeaderView from './header/IndexView.vue'

// 加载过程信息
await listProcessesService()
</script>
<template>
  <HeaderView />
  <RouterView />
</template>
