<script setup lang="ts">
import { getInfosService } from '@/services/TeacherService'

import { listProcessesService } from '@/services'

// 加载指导学生/组学生/评审信息
getInfosService()
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
