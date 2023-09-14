<script setup lang="ts">
import { useInfosStore } from '@/stores/InfosStore'

const groupStore = useInfosStore()
const studentsR = storeToRefs(groupStore).tutortudentsS
</script>
<template>
  <el-row class="my-row">
    <el-col style="margin-bottom: 10px">
      <el-table :data="studentsR">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column property="name" min-width="50" />
        <el-table-column min-width="50">
          <template #default="scope">
            {{ scope.row.groupNumber }}组；{{ scope.row.queueNumber }}号
          </template>
        </el-table-column>
        <el-table-column min-width="150">
          <template #default="scope">
            {{ scope.row.projectTitle }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
