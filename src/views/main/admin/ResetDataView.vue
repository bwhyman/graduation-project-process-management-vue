<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { resetData } from '@/services/AdminService'

const visible = ref(false)

const resetF = async () => {
  await resetData()
  createElNotificationSuccess('数据重置成功')
  visible.value = false
}
</script>
<template>
  <div>
    <el-button type="danger" @click="visible = true">重置学生测试选择数据</el-button>

    <el-dialog v-model="visible" title="Warning" width="30%">
      <span>重置学生测试时的选择数据。数据将不可恢复？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="resetF">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
