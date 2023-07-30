<script setup lang="ts">
import { listProcessesService } from '@/services'

// 加载过程信息
listProcessesService()
</script>
<template>
  <RouterView />
</template>
