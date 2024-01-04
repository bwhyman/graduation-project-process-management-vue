<script setup lang="ts">
import router from '@/router'
import { listProcessesService } from '@/services'
import {
  getProcessFileService,
  listGroupStudentsService,
  listPorcessFilesService
} from '@/services/TeacherService'
import type { ProcessFile, Student, StudentAttach } from '@/types'
const props = defineProps<{ pid?: string }>()
const result = await Promise.all([listProcessesService(), listGroupStudentsService()])

const studentsR = ref<Student[]>(result[1])
const processFilesR = ref<ProcessFile[]>([])
// 加载带学生附件过程
const processesS = result[0].filter((ps) => ps.studentAttach)

const selectProcessR = ref(props.pid)
const studentAttachsR = ref<StudentAttach[]>([])

const selectProcessChangeF = async () => {
  router.push(`/processfiles/${selectProcessR.value}`)
}
watch(
  props,
  async () => {
    if (!props.pid) return
    const selectProcess = processesS.find((p) => p.id == props.pid)
    if (!selectProcess) return
    studentAttachsR.value = selectProcess.studentAttach!
    processFilesR.value = await listPorcessFilesService(selectProcess?.id!, selectProcess?.auth!)
  },
  { immediate: true }
)

//
const processFileC = computed(
  () => (sid: string, number: number) =>
    processFilesR.value.find((pf) => pf.studentId == sid && pf.number == number)
)

const clickAttachF = (sid: string, number: number) => {
  const pname = processFilesR.value.find((pf) => pf.studentId == sid && pf.number == number)?.detail
  pname && getProcessFileService(pname)
}
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-radio-group
        @change="selectProcessChangeF"
        v-model="selectProcessR"
        style="margin-bottom: 10px">
        <el-radio-button v-for="(pro, index) of processesS" :key="index" :label="pro.id">
          {{ pro.name }}
        </el-radio-button>
      </el-radio-group>
    </el-col>
    <el-col>
      <el-table :data="studentsR">
        <el-table-column min-width="220">
          <template #default="scope">
            <el-text type="primary" size="large">{{ scope.row.name }}</el-text>
            <br />
            {{ scope.row.student.teacherName }}
            <br />
            {{ scope.row.student.projectTitle }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <template v-for="(attach, index) of studentAttachsR" :key="index">
              <el-button
                type="success"
                style="margin-bottom: 5px"
                @click="clickAttachF(scope.row.id, attach.number!)"
                v-if="processFileC(scope.row.id, attach.number!)">
                {{ attach.name }}
              </el-button>
              <br />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<style scoped>
#refresh :hover {
  cursor: pointer;
}
</style>
