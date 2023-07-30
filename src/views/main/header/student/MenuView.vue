<script setup lang="ts">
import { useProcessStore } from '@/stores/ProcessStore'

const router = useRouter()
const activeIndex = ref(router.currentRoute.value.path)

const studentPR = storeToRefs(useProcessStore()).studentProcessesS
</script>
<template>
  <el-menu :default-active="activeIndex" mode="horizontal" router>
    <el-menu-item index="/student">导师</el-menu-item>
    <template v-for="(stuP, index) in studentPR" :key="index">
      <el-menu-item :index="`/student/processes/${stuP.processId}`">{{ stuP.name }}</el-menu-item>
    </template>
  </el-menu>
</template>
