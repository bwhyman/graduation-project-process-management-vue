<script setup lang="ts">
import type { ProcessItem, StudentAttach } from '@/types'
import { processAuths } from '@/services/Const'
import { listProcessesService } from '@/services/AdminService'
import AddProcessVue from './processes/AddProcessVue.vue'
import EditProcessVue from './processes/OperationProcessVue.vue'

const processesS = await listProcessesService()

const authC = computed(() => (authVal: string) => processAuths.find((pa) => pa.v === authVal)?.name)
</script>
<template>
  <el-row class="my-row">
    <el-col :span="24">
      <AddProcessVue />
    </el-col>
    <el-col :span="24">
      <el-table :data="processesS">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column width="150">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column width="60">
          <template #default="scope">
            {{ authC(scope.row.auth) }}
          </template>
        </el-table-column>
        <el-table-column width="80">
          <template #default="scope">{{ scope.row.point }}%</template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <template v-for="(item, index) of scope.row.items" :key="index">
              <span>{{ (item as ProcessItem).name }} - {{ (item as ProcessItem).point }}%</span>
              <br />
            </template>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <template v-for="(item, index) of scope.row.studentAttach" :key="index">
              <span>{{ (item as StudentAttach).name }} - {{ (item as StudentAttach).ext }}</span>
              <br />
            </template>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <EditProcessVue :process="scope.row" />
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
