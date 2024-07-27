<script setup lang="ts">
const components: { name: string; component: Component }[] = [
  {
    name: '过程管理',
    component: defineAsyncComponent(() => import('./ProcessesView.vue'))
  },
  {
    name: '导入学生',
    component: defineAsyncComponent(() => import('./ImportStudentView.vue'))
  },
  {
    name: '分配',
    component: defineAsyncComponent(() => import('./AssignStudentView.vue'))
  },
  {
    name: '分组',
    component: defineAsyncComponent(() => import('./GroupingView.vue'))
  },
  {
    name: '导入覆盖',
    component: defineAsyncComponent(() => import('./ImportStudentsInfoView.vue'))
  },
  {
    name: '重置密码',
    component: defineAsyncComponent(() => import('./ResetPasswordView.vue'))
  },
  {
    name: '更新用户信息',
    component: defineAsyncComponent(() => import('./EditUserView.vue'))
  },
  {
    name: '导出详细成绩表格',
    component: defineAsyncComponent(() => import('./ExportScoresView.vue'))
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
