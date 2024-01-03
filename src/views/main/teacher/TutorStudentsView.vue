<script setup lang="ts">
import { listTutorStudentsService } from '@/services/TeacherService'
import { useInfosStore } from '@/stores/InfosStore'
import type { User } from '@/types'
// 加载指导学生
await listTutorStudentsService()
const studentsR = storeToRefs(useInfosStore()).tutortudentsS
</script>
<template>
  <el-row class="my-row">
    <el-col style="margin-bottom: 10px">
      <el-table :data="studentsR">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column property="name" min-width="50" />
        <el-table-column min-width="50">
          <template #default="scope">
            {{ scope.row.groupNumber }}组；{{ scope.row.student.queueNumber }}号
          </template>
        </el-table-column>
        <el-table-column min-width="150">
          <template #default="scope">
            {{ (scope.row as User).student?.projectTitle }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
