<script setup lang="ts">
import { TeacherService } from '@/services/TeacherService'
import type { User } from '@/types'

const props = defineProps<{ tid: string }>()
const teacherR = ref<User>()
defineExpose({ teacher: teacherR })
const teachersR = await TeacherService.listTeachersService()
watch(
  () => props.tid,
  () => {
    teacherR.value = teachersR.value.find((t) => t.id === props.tid)
  },
  { immediate: true }
)
</script>
<template>
  <el-select
    value-key="id"
    v-model="teacherR"
    placeholder="新导师"
    size="large"
    style="width: 200px; margin-right: 10px">
    <el-option
      v-for="(teacher, index) of teachersR"
      :key="index"
      :label="teacher.name"
      :value="teacher" />
  </el-select>
</template>
