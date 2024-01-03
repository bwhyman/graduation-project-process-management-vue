<script setup lang="ts">
import { listGroupTeachersService } from '@/services/TeacherService'
import { useInfosStore } from '@/stores/InfosStore'
await listGroupTeachersService()

const groupTeachersR = storeToRefs(useInfosStore()).groupTeachersS
</script>
<template>
  <el-row class="my-row">
    <el-col style="margin-bottom: 10px">
      <div>
        第
        <el-tag>{{ groupTeachersR[0].groupNumber }}</el-tag>
        组评审：
        <span style="margin-right: 5px" v-for="(teacher, index) of groupTeachersR" :key="index">
          {{ teacher.name }};
        </span>
      </div>
    </el-col>
  </el-row>
</template>
