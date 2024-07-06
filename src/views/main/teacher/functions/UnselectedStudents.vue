<script setup lang="ts">
import { TeacherService } from '@/services/TeacherService'
import type { User } from '@/types'

const studentsR = ref<User[]>([])
const showUnSelectedR = ref(false)
const getStu = async () => {
  studentsR.value = await TeacherService.getUnselectedStudentsService()
  showUnSelectedR.value = true
}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-button type="primary" @click="getStu">未选择学生</el-button>
    </el-col>
    <el-col>
      <p v-if="showUnSelectedR">
        未选学生数:
        <el-tag type="danger">{{ studentsR.length }}</el-tag>
        <br />
        <span v-for="(st, index) in studentsR" :key="index">{{ st.name }};</span>
      </p>
    </el-col>
  </el-row>
</template>
