<script setup lang="ts">
import { listProcessesService } from '@/services'
import {
  getProcessFileService,
  listGroupStudentsService,
  listPorcessFilesService
} from '@/services/TeacherService'
import { useInfosStore } from '@/stores/InfosStore'
import { useProcessStore } from '@/stores/ProcessStore'
import type { ProcessFile, Student, StudentAttach } from '@/types'
import { Refresh } from '@element-plus/icons-vue'

await Promise.all([listProcessesService(), listGroupStudentsService()])

const studentsR = ref<Student[]>([])
const processFilesR = ref<ProcessFile[]>([])
// 加载带学生附件过程
const processesS = useProcessStore().processesS.filter((ps) => ps.studentAttach)
const selectProcessIndexR = ref(-1)
const studentAttachsR = ref<StudentAttach[]>([])

const selectProcessChangeF = async () => {
  const selectProcess = processesS[selectProcessIndexR.value]
  studentAttachsR.value = selectProcess.studentAttach!
  processFilesR.value = await listPorcessFilesService(selectProcess?.id!, selectProcess?.auth!)
  studentsR.value = useInfosStore().groupStudentsS
}
//
//
const processFileC = computed(
  () => (sid: string, number: number) =>
    processFilesR.value.find((pf) => pf.studentId == sid && pf.number == number)
)

const clickAttachF = (sid: string, number: number) => {
  const pname = processFilesR.value.find((pf) => pf.studentId == sid && pf.number == number)?.detail
  pname && getProcessFileService(pname)
}
const refreshF = async () => {
  const selectProcess = processesS[selectProcessIndexR.value]
  studentAttachsR.value = selectProcess.studentAttach!
  processFilesR.value = await listPorcessFilesService(selectProcess?.id!, selectProcess?.auth!)
}
</script>
<template>
  <el-row class="my-row">
    <el-col :span="22">
      <el-radio-group
        @change="selectProcessChangeF"
        v-model="selectProcessIndexR"
        style="margin-bottom: 10px">
        <el-radio-button v-for="(pro, index) of processesS" :key="index" :label="index">
          {{ pro.name }}
        </el-radio-button>
      </el-radio-group>
    </el-col>
    <el-col :span="2">
      <el-icon id="refresh" :size="32" color="red" @click="refreshF">
        <Refresh />
      </el-icon>
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
