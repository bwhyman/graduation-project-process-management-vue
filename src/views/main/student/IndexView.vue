<script setup lang="ts">
import { listProcessesService } from '@/services'

// 加载过程信息
listProcessesService()
</script>
<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" :key="$route.path" />
    </KeepAlive>
  </RouterView>
</template>
