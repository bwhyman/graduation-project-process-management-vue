<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { listTeachersService, updateStudentTeacherService } from '@/services/AdminService'
import type { User } from '@/types'
import { Check } from '@element-plus/icons-vue'
import FindUserVue from './finduser/FindUserVue.vue'

const findUserVueR = ref<{ user: User }>()
const teachersR = ref<User[]>([])
const teacherSelectR = ref<string>()

onMounted(() => {
  watchEffect(async () => {
    const user = findUserVueR.value?.user
    if (user) {
      teachersR.value = await listTeachersService()
      teacherSelectR.value = teachersR.value.find((t) => t.id === user.student?.teacherId)?.id
    }
  })
})

//
const updateStudentTeacherF = async () => {
  const user = findUserVueR.value?.user
  const newTeacher = teachersR.value.find((t) => t.id === teacherSelectR.value)
  const temp = user?.student ?? {}
  temp.teacherId = newTeacher?.id
  temp.teacherName = newTeacher?.name
  user?.id && (await updateStudentTeacherService(user.id, temp))
  createElNotificationSuccess('更新导师成功')
  findUserVueR.value && (findUserVueR.value.user = {})
}
</script>
<template>
  <el-row class="my-row" :gutter="10">
    <el-col :span="24" class="my-col">
      <p>更新学生指导教师。</p>
    </el-col>
    <FindUserVue ref="findUserVueR" />
    <el-col :span="24" v-if="findUserVueR?.user?.id" class="my-col">
      <el-select
        v-model="teacherSelectR"
        placeholder="新导师"
        size="large"
        style="width: 200px; margin-right: 10px">
        <el-option
          v-for="(teacher, index) of teachersR"
          :key="index"
          :label="teacher.name"
          :value="teacher.id" />
      </el-select>
      <el-button type="success" @click="updateStudentTeacherF" :icon="Check"></el-button>
    </el-col>
  </el-row>
</template>
