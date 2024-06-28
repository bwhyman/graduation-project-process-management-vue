<script setup lang="ts">
import { listProcessesService } from '@/services'
const menus = [
  {
    name: '学生',
    path: '/teacher'
  }
]

const processesS = await listProcessesService()
processesS.value.forEach((ps) => {
  menus.push({ name: ps.name!, path: `/teacher/processes/${ps.id}/types/${ps.auth}` })
})
const route = useRoute()
const activeIndexR = ref('')
watch(
  route,
  () => {
    const p = menus.find((mn) => mn.path == route.path)
    activeIndexR.value = p?.path ?? ''
  },
  { immediate: true }
)
</script>
<template>
  <el-menu :default-active="activeIndexR" mode="horizontal" router>
    <template v-for="(menu, index) in menus" :key="index">
      <el-menu-item :index="menu.path">
        {{ menu.name }}
      </el-menu-item>
    </template>
    <el-menu-item index="/teacher/scores">小组成绩统计</el-menu-item>
    <el-menu-item index="/teacher/functions">功能</el-menu-item>
  </el-menu>
</template>
