<script lang="ts" setup>
import { listTeachersService, selectTeacher } from '@/services/StudentService'
import { useUserStore } from '@/stores/UserStore'
import type { Student, Teacher } from '@/types'

const result = await listTeachersService()

const teachersR = ref(result.teachers ?? [])
const startTimeR = ref(result.starttime)
const selectVisible = ref(false)
const selecedTeacherR = ref<Teacher>({})

const userStore = useUserStore()
const userR = storeToRefs(userStore).userS as Ref<Student>

const select = (teacher: Teacher) => {
  selectVisible.value = true
  selecedTeacherR.value = teacher
}

const confirm = () => {
  if (!selecedTeacherR.value.id) return

  selectTeacher(selecedTeacherR.value.id).then((result) => {
    teachersR.value = result.teachers ?? []
    selectVisible.value = false
  })
  selectVisible.value = false
}
</script>
<template>
  <!-- <el-row class="my-row">
    <el-col style="margin-bottom: 10px">
      <el-steps :active="-1" finish-status="success" style="width: 100%" align-center>
        <el-step title="Wait"></el-step>
        <el-step title="Choose"></el-step>
        <el-step title="Confirm"></el-step>
      </el-steps>
    </el-col>

    <el-col align="center">
      开放时间：
      <el-tag type="danger" effect="light">
        {{ startTimeR.replace('T', ' ').substring(0, 16) }}
      </el-tag>
    </el-col>
  </el-row> -->
  <!-- <el-row class="my-row" v-if="teachersR.length > 0">
    <el-col>
      <el-table :data="teachersR">
        <el-table-column label="#" type="index" align="center" />
        <el-table-column label="Operations" align="center">
          <template #default="scope">
            <el-button
              :type="scope.row.total > scope.row.count ? 'success' : 'info'"
              style="padding-top: 5px; padding-bottom: 5px"
              round
              :disabled="!(scope.row.total > scope.row.count)"
              @click="select(scope.row)">
              <span style="width: 70px">
                {{ scope.row.name }}
                <br />
                {{ `${scope.row.count} / ${scope.row.total}` }}
              </span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row> -->

  <el-row class="my-row" v-if="userR.student?.teacherId">
    <el-col>
      <div style="margin: auto; padding-bottom: 10px" align="center">
        <p>
          指导教师：
          <el-tag type="danger" effect="light">
            {{ userR.student?.teacherName }}
          </el-tag>
          老师
        </p>
        <p v-if="userR.projectTitle">
          {{ userR.projectTitle }}
        </p>
        <p v-if="userR.groupNumber">
          毕设答辩组：
          <el-tag type="success" effect="light">
            {{ userR.groupNumber }}
          </el-tag>
          ； 答辩顺序：
          <el-tag type="success" effect="light">
            {{ userR.student.queueNumber }}
          </el-tag>
        </p>
      </div>
    </el-col>
  </el-row>

  <el-dialog v-model="selectVisible" title="Warning" width="30%">
    <span>
      您选择了
      <el-tag type="danger" effect="light" style="margin: 0 5px">
        {{ selecedTeacherR.name }}
      </el-tag>
      老师
      <br />
      确定后将不可更改
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>
