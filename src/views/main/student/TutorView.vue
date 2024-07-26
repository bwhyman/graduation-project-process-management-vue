<script lang="ts" setup>
import { useUserStore } from '@/stores/UserStore'

const userS = useUserStore().userS
</script>
<template>
  <el-row class="my-row" v-if="userS?.student?.teacherId">
    <el-col>
      <div style="margin: auto; padding-bottom: 10px" align="center">
        <p>
          指导教师：
          <el-tag type="danger" effect="light">
            {{ userS?.student?.teacherName }}
          </el-tag>
          老师
        </p>
        <p v-if="userS.student.projectTitle">
          {{ userS.student.projectTitle }}
        </p>
        <p v-if="userS.groupNumber">
          毕设答辩组：
          <el-tag type="success" effect="light">
            {{ userS.groupNumber }}
          </el-tag>
          ； 答辩顺序：
          <el-tag type="success" effect="light">
            {{ userS.student.queueNumber }}
          </el-tag>
        </p>
      </div>
    </el-col>
  </el-row>
</template>
