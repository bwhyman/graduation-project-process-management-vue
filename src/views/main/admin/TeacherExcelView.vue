<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { AdminService } from '@/services/AdminService'
import { readTeacherFile } from '@/services/ExcelUtils'
import type { Department, User } from '@/types'
import { Check } from '@element-plus/icons-vue'

const departmentsR = await AdminService.listDepartmentsService()
const departmentR = ref<Department>()

const teachersR = ref<User[]>([])
// read teacher excel
const readTeacher = (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readTeacherFile(element.files[0]).then((ts: User[]) => {
    teachersR.value = ts
  })
}

const submitTeachersF = async () => {
  if (!departmentR.value?.id) return
  await AdminService.addTeachers(teachersR.value, departmentR.value.id)
  teachersR.value = []
  createElNotificationSuccess('导师添加成功')
}
</script>
<template>
  <el-row class="my-row">
    <el-col class="my-col">
      <el-select
        value-key="id"
        v-model="departmentR"
        placeholder="专业"
        size="large"
        style="width: 200px; margin-right: 10px">
        <el-option
          v-for="(depart, index) of departmentsR"
          :key="index"
          :label="depart.name"
          :value="depart" />
      </el-select>
    </el-col>
    <el-col class="my-col" v-if="departmentR">
      读取包含带学生成绩数量的导师表格：
      <input type="file" @change="readTeacher" />
      <el-button
        type="success"
        :icon="Check"
        :disabled="teachersR.length == 0"
        @click="submitTeachersF"></el-button>
      <br />
      {{ teachersR[0] }} / {{ teachersR?.length }}
    </el-col>
  </el-row>
</template>
