<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import { updateStartTime } from '@/services/AdminService'
import { createElNotificationSuccess } from '@/components/message'
// update starttime
const startTime = ref<string>()
const addStartTime = () => {
  startTime.value && updateStartTime(startTime.value)
  startTime.value = ''
  createElNotificationSuccess('修改时间成功')
}
</script>
<template>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
      <el-date-picker
        value-format="YYYY-MM-DDTHH:mm:ss"
        v-model="startTime"
        type="datetime"
        placeholder="选择开始时间"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button
        type="success"
        :icon="Check"
        :disabled="!startTime"
        @click="addStartTime"></el-button>
    </el-form-item>
  </el-form>
</template>
