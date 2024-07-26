<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { AdminService } from '@/services/AdminService'
import { Delete } from '@element-plus/icons-vue'

const departmentsR = await AdminService.listDepartmentsService()
const departmentNameR = ref('')
const addDepartmentF = async () => {
  if (departmentNameR.value.length == 0) return
  await AdminService.addDepartmentService(departmentNameR.value)
  createElNotificationSuccess('添加部门成功')
}

const delDepartmentF = async (did: string) => {
  await AdminService.delDepartmentService(did)
  createElNotificationSuccess('移除部门成功')
}
</script>
<template>
  <el-row class="my-row">
    <el-col class="my-col" :span="6" placeholder="专业名称" style="margin-right: 10px">
      <el-input v-model="departmentNameR" />
    </el-col>
    <el-col :span="6">
      <el-button type="success" @click="addDepartmentF" :disabled="!departmentNameR">
        提交
      </el-button>
    </el-col>
    <el-col class="my-col">
      <el-table :data="departmentsR">
        <el-table-column type="index" label="" width="50" />
        <el-table-column>
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-button @click="delDepartmentF(scope.row.id)" :icon="Delete" circle type="danger" />
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
