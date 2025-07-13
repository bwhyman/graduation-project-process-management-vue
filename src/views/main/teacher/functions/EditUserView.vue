<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { TeacherService } from '@/services/TeacherService'
import type { User } from '@/types'
import FindUserVue from './finduser/FindUserVue.vue'
const GetTeacherVue = defineAsyncComponent(() => import('./GetTeacherVue.vue'))

const findUserVueR = ref<{ user: User }>()
const studentTid = ref('')
const userR = ref<User>()
const tutorR = ref<{ teacher: User }>()
watch(
  () => findUserVueR.value?.user,
  () => {
    userR.value = JSON.parse(JSON.stringify(findUserVueR.value?.user))
    studentTid.value = userR.value?.student?.teacherId ?? ''
  }
)

//
const updateStudentTeacherF = async () => {
  if (!userR.value?.id) return
  userR.value.student ??= {}
  userR.value.student.teacherId = tutorR.value?.teacher.id
  userR.value.student.teacherName = tutorR.value?.teacher.name

  await TeacherService.updateStudentService(userR.value)
  createElNotificationSuccess('更新导师成功')
  findUserVueR.value && (findUserVueR.value.user = {})
}
</script>
<template>
  <el-row class="my-row">
    <el-col class="my-col">
      <FindUserVue ref="findUserVueR" />
    </el-col>
    <el-col v-if="userR?.id" class="my-col">
      <el-form label-width="60px" style="width: 300px">
        <el-form-item label="姓名">
          {{ userR.name }}
        </el-form-item>
        <el-form-item label="题目" v-if="userR.student?.projectTitle">
          <el-input v-model="userR.student.projectTitle" />
        </el-form-item>
        <el-form-item label="分组" style="width: 150px">
          <el-input type="number" v-model.number="userR.groupNumber" />
        </el-form-item>
        <el-form-item label="导师">
          <GetTeacherVue :tid="studentTid" ref="tutorR" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="updateStudentTeacherF">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col v-if="findUserVueR?.user?.id" class="my-col">
      <!-- <el-button type="success" @click="updateStudentTeacherF" :icon="Check"></el-button> -->
    </el-col>
  </el-row>
</template>
