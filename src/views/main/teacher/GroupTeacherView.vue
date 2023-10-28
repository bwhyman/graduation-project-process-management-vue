<script setup lang="ts">
import { getInfosService } from '@/services/TeacherService'
import { useUserStore } from '@/stores/UserStore'

const result = await getInfosService()
const useStore = useUserStore()
const userR = storeToRefs(useStore).userS

const groupTeachersR = result.groupTeachersS
</script>
<template>
  <el-row class="my-row">
    <el-col style="margin-bottom: 10px">
      <div>
        第
        <el-tag>{{ userR.groupNumber }}</el-tag>
        组评审：
        <span style="margin-right: 5px" v-for="(teacher, index) of groupTeachersR" :key="index">
          {{ teacher.name }};
        </span>
      </div>
    </el-col>
  </el-row>
</template>
