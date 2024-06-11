<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { delProcessService } from '@/services/AdminService'
import type { Process } from '@/types'
import { Delete, Edit } from '@element-plus/icons-vue'
import { createEditProcessDialog } from '.'

const prop = defineProps<{ process: Process }>()

const delPorcessF = (pid: string) => {
  ElMessageBox.confirm(
    `删除<span style="color: red; font-weight: bold">${prop.process.name}</span>将不可恢复，确定删除？`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      dangerouslyUseHTMLString: true
    }
  ).then(async () => {
    await delProcessService(pid)
    createElNotificationSuccess('过程已删除')
  })
}
</script>
<template>
  <el-button type="primary" :icon="Edit" circle @click="createEditProcessDialog(prop.process)" />
  <el-button type="danger" :icon="Delete" circle @click="delPorcessF(prop.process.id ?? '')" />
</template>
