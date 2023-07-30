<script setup lang="ts">
import type { Process, ProcessItem, StudentProcess } from '@/types/type'
import { Check, Plus } from '@element-plus/icons-vue'
import { processAuths } from '@/services/Const'
import { addProcessService } from '@/services/AdminService'
import { useProcessStore } from '@/stores/ProcessStore'
import { listProcessesService } from '@/services'

listProcessesService()

const dialogVisible = ref(false)
const processR = ref<Process>({})
const processItemR = ref<ProcessItem>({})
const processItemsR = ref<ProcessItem[]>([])
//
const processAttachR = ref<StudentProcess>({})
const processAttachsR = ref<StudentProcess[]>([])
//
const processStore = useProcessStore()
const processesR = storeToRefs(processStore).processesS

const addItemF = () => {
  processItemR.value.number = processItemsR.value.length
  processItemsR.value.push(processItemR.value)
  processItemR.value = {}
  processR.value.items = processItemsR.value
}

const addAttachF = () => {
  processAttachsR.value.push(processAttachR.value)
  processAttachR.value = {}
  processR.value.studentAttach = processAttachsR.value
}

const addProcessF = () => {
  addProcessService(processR.value)
  dialogVisible.value = false
}

const pointC = computed(() => {
  let points = 0
  processItemsR.value.forEach((i) => i.point && (points = i.point + points))
  return points == 100
})

watch(dialogVisible, () => {
  processR.value = {}
  processItemR.value = {}
  processItemsR.value = []
})
</script>
<template>
  <el-button @click="dialogVisible = true" type="primary">加载过程数据</el-button>

  <el-dialog v-model="dialogVisible" title="Message" width="50%" :close-on-click-modal="false">
    {{ processesR }}
    <el-form :model="processR">
      <div>
        <el-row :gutter="10" style="margin-bottom: 10px">
          <el-col :span="6">
            <el-input v-model="processR.name" placeholder="名称" />
          </el-col>
          <el-col :span="6">
            <el-select v-model="processR.auth" placeholder="类型">
              <el-option
                v-for="(pa, index) in processAuths"
                :key="index"
                :label="pa.name"
                :value="pa.v"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="processItemR.name" placeholder="项名称" />
        </el-col>
        <el-col :span="6">
          <el-input v-model.number="processItemR.point" placeholder="比例" type="number" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="processItemR.description" placeholder="描述" />
        </el-col>
        <el-col :span="6">
          <el-button
            type="success"
            :icon="Plus"
            @click="addItemF"
            :disabled="!(processItemR.name && processItemR.point)"></el-button>
        </el-col>
        <el-text type="danger" v-if="!pointC" style="margin-left: 15px">
          各项point之和必须为100%。{{ processItemsR }}
        </el-text>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="processAttachR.name" placeholder="学生附件名称" />
        </el-col>
        <el-col :span="6">
          <el-button
            type="success"
            :icon="Plus"
            @click="addAttachF"
            :disabled="!processAttachR.name"></el-button>
        </el-col>
      </el-row>
      {{ processR }}
      <br />
      <el-button
        type="success"
        :icon="Check"
        @click="addProcessF"
        :disabled="!processR.auth || !processR.name" />
    </el-form>
  </el-dialog>
</template>
