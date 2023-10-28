<script setup lang="ts">
import { useProcessStore } from '@/stores/ProcessStore'
const menus = [
  {
    name: '学生',
    path: '/teacher'
  }
]
const processStore = useProcessStore()
const processes = processStore.processesS
processes.forEach((ps) => {
  menus.push({ name: ps.name!, path: `/teacher/processes/${ps.id}/types/${ps.auth}` })
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
      <el-menu-item :index="menu.path">
        {{ menu.name }}
      </el-menu-item>
    </template>
    <el-menu-item index="/teacher/operations">功能</el-menu-item>
  </el-menu>
</template>
