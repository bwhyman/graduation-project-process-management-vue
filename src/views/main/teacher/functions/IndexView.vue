<script setup lang="ts">
const components: { name: string; component: Component }[] = [
  {
    name: '重置账号密码',
    component: defineAsyncComponent(() => import('./ResetPasswordView.vue'))
  },
  {
    name: '加载未选中学生信息',
    component: defineAsyncComponent(() => import('./UnselectedStudents.vue'))
  },
  {
    name: '导出互选表格',
    component: defineAsyncComponent(() => import('./ExportStudentsSelected.vue'))
  },
  {
    name: '导出分组/顺序表格',
    component: defineAsyncComponent(() => import('./ExportStudentsGroup.vue'))
  },
  {
    name: '导出详细成绩表格',
    component: defineAsyncComponent(() => import('./ExportScores.vue'))
  }
]

const currentComponentR = ref()
const currentComponentC = computed(
  () => components.find((com) => com.name == currentComponentR.value)?.component
)
const typeC = computed(() => (name: string) => (name == currentComponentR.value ? 'danger' : ''))
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-tag
        v-for="(com, index) of components"
        :type="typeC(com.name)"
        :key="index"
        @click="currentComponentR = com.name"
        style="cursor: pointer; margin-right: 10px">
        {{ com.name }}
      </el-tag>

      <RouterLink replace to="/processfiles" style="cursor: pointer; margin-right: 10px">
        <el-tag>加载过程学生文件</el-tag>
      </RouterLink>
    </el-col>
  </el-row>
  <template v-if="currentComponentR">
    <component :is="currentComponentC" />
  </template>
</template>
