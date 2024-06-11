<script setup lang="ts">
const components: { name: string; component: Component }[] = [
  {
    name: '过程管理',
    component: defineAsyncComponent(() => import('./ProcessesView.vue'))
  },
  {
    name: '导入导师表格',
    component: defineAsyncComponent(() => import('./TeacherExcelView.vue'))
  },
  {
    name: '导入学生表格',
    component: defineAsyncComponent(() => import('./StudentSelectionView.vue'))
  },
  {
    name: '导入题目/分组/顺序',
    component: defineAsyncComponent(() => import('./UpdateStudentView.vue'))
  },
  {
    name: '更新学生导师',
    component: defineAsyncComponent(() => import('./EditStudentVue.vue'))
  },
  {
    name: '更新组',
    component: defineAsyncComponent(() => import('./UpdateGroupVue.vue'))
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
    <el-col class="my-col">
      <el-tag
        v-for="(com, index) of components"
        :type="typeC(com.name)"
        :key="index"
        @click="currentComponentR = com.name"
        style="cursor: pointer; margin-right: 10px">
        {{ com.name }}
      </el-tag>
    </el-col>
  </el-row>
  <template v-if="currentComponentR">
    <component :is="currentComponentC" />
  </template>
</template>
