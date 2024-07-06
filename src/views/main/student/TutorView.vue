<script lang="ts" setup>
import { CommonService } from '@/services'
import type { Student } from '@/types'

const userS = CommonService.getStoreUserService()
const userR = userS as Ref<Student>
</script>
<template>
  <el-row class="my-row" v-if="userR.student?.teacherId">
    <el-col>
      <div style="margin: auto; padding-bottom: 10px" align="center">
        <p>
          指导教师：
          <el-tag type="danger" effect="light">
            {{ userR.student?.teacherName }}
          </el-tag>
          老师
        </p>
        <p v-if="userR.projectTitle">
          {{ userR.projectTitle }}
        </p>
        <p v-if="userR.groupNumber">
          毕设答辩组：
          <el-tag type="success" effect="light">
            {{ userR.groupNumber }}
          </el-tag>
          ； 答辩顺序：
          <el-tag type="success" effect="light">
            {{ userR.student.queueNumber }}
          </el-tag>
        </p>
      </div>
    </el-col>
  </el-row>
</template>
