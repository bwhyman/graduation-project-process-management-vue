<script setup lang="ts">
import { listProcessesService } from '@/services'

const menus = [
  {
    name: '导师',
    path: '/student'
  }
]
const processesS = await listProcessesService()

processesS.value.forEach((pr) => {
  menus.push({ name: pr.name!, path: `/student/processes/${pr.id}` })
})
const route = useRoute()
const activeIndexR = ref('')
watch(route, () => {
  const p = menus.find((mn) => route.path.includes(mn.path))
  activeIndexR.value = p?.path ?? ''
})
</script>
<template>
  <el-menu :default-active="activeIndexR" mode="horizontal" router>
    <template v-for="(menu, index) in menus" :key="index">
      <el-menu-item :index="menu.path">{{ menu.name }}</el-menu-item>
    </template>
  </el-menu>
</template>
