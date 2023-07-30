<script setup lang="ts">
import { useProcessStore } from '@/stores/ProcessStore'
const router = useRouter()
const activeIndex = ref(router.currentRoute.value.path)

const processStore = useProcessStore()
const processesR = storeToRefs(processStore).processesS
</script>
<template>
  <el-menu :default-active="activeIndex" mode="horizontal" router>
    <el-menu-item index="/teacher">学生</el-menu-item>
    <template v-for="(ps, index) in processesR" :key="index">
      <el-menu-item :index="`/teacher/processes/${ps.id}/types/${ps.auth}`">
        {{ ps.name }}
      </el-menu-item>
    </template>
  </el-menu>
</template>
