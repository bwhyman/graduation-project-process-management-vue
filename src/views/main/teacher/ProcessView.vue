<script setup lang="ts">
import {
  addPorcessScoreService,
  listPorcessFilesService,
  getProcessFileService,
  listProcessScoresService,
  listTutorStudentsService,
  listGroupStudentsService
} from '@/services/TeacherService'
import type {
  StudentProcessScore,
  PSDetail,
  PSDetailTeacher,
  ProcessFile,
  ProcessScore,
  Student,
  LevelCount
} from '@/types'
import { PA_REVIEW } from '@/services/Const'
import GroupTeacherView from './GroupTeacherView.vue'
import { Brush, Box } from '@element-plus/icons-vue'
import { getStoreUserService, listProcessesService } from '@/services'

// --------------------
const params = useRoute().params as { pid: string; auth: string }

const processFilesR = ref<ProcessFile[]>([])
const userS = getStoreUserService()

const result = await Promise.all([
  params.auth == PA_REVIEW ? listGroupStudentsService() : listTutorStudentsService(),
  listProcessScoresService(params.pid, params.auth),
  listPorcessFilesService(params.pid, params.auth),
  listProcessesService()
])
const studentsS = result[0]
const processesS = result[3]
//
const levelCount = ref<LevelCount>({
  score_last: 0,
  score_60: 0,
  score_70: 0,
  score_80: 0,
  score_90: 0,
  len: studentsS.value.length
})
const currentPStudentsR = ref<StudentProcessScore[]>([])

collectPS(result[1])
processFilesR.value = result[2]

// 聚合评分数据
function collectPS(pses: ProcessScore[]) {
  levelCount.value = {
    score_last: 0,
    score_60: 0,
    score_70: 0,
    score_80: 0,
    score_90: 0,
    len: studentsS.value.length
  }
  currentPStudentsR.value = []
  ;(studentsS.value as Student[]).forEach((student) => {
    const stuD: StudentProcessScore = JSON.parse(JSON.stringify(student))
    currentPStudentsR.value.push(stuD)
    let temp = 0
    stuD.psTeachers = []
    stuD.averageScore = temp

    const teacherPSs = pses.filter((ps) => ps.studentId == stuD.id)
    if (!teacherPSs) return
    teacherPSs.forEach((ps) => {
      const psDetail = ps.detail as PSDetail
      psDetail.score && (temp += psDetail.score)
      const psTeacher: PSDetailTeacher = {
        processScoreId: ps.id,
        teacherId: ps.teacherId,
        teacherName: psDetail.teacherName,
        score: psDetail.score,
        detail: psDetail.detail
      }
      stuD.psTeachers?.push(psTeacher)
      if (ps.teacherId == userS.value.id) {
        stuD.currentTeacherScore = psDetail.score
      }
    })
    stuD.psTeachers.length > 0 && (stuD.averageScore = temp / stuD.psTeachers.length)
    stuD.averageScore = Math.round(stuD.averageScore)

    if (stuD.averageScore >= 90) {
      levelCount.value.score_90++
    } else if (stuD.averageScore >= 80 && stuD.averageScore < 90) {
      levelCount.value.score_80++
    } else if (stuD.averageScore >= 70 && stuD.averageScore < 80) {
      levelCount.value.score_70++
    } else if (stuD.averageScore >= 60 && stuD.averageScore < 70) {
      levelCount.value.score_60++
    } else if (stuD.averageScore < 60) {
      levelCount.value.score_last++
    }
  })
}

//
const currentProcessAttach = processesS.value.find((ps) => ps.id == params.pid)?.studentAttach
// ---------------------
const addProcessScoreF = (ps: ProcessScore) => {
  addPorcessScoreService(ps, params.auth).then((pses) => collectPS(pses))
}

//
const processFileC = computed(
  () => (sid: string, number: number) =>
    processFilesR.value.find((pf) => pf.studentId == sid && pf.number == number)
)

const clickAttachF = async (sid: string, number: number) => {
  const pname = processFilesR.value.find((pf) => pf.studentId == sid && pf.number == number)?.detail
  pname && (await getProcessFileService(pname))
}
// --------------------
// 评分
const gradingDialog = defineAsyncComponent(() => import('./GradingDialog.vue'))
const currentStudentR = ref<StudentProcessScore>()

const gradingDialogVisable = ref(false)
const gradeF = (s: StudentProcessScore) => {
  gradingDialogVisable.value = true
  currentStudentR.value = s
}
// 传给子组件
const closeF = () => (gradingDialogVisable.value = false)
</script>
<template>
  <GroupTeacherView />
  <el-row class="my-row">
    <el-col style="margin-bottom: 10px">
      <div>
        优秀
        <el-tag>{{ levelCount.score_90 }}</el-tag>
        ； 良好
        <el-tag>{{ levelCount.score_80 }}</el-tag>
        ； 中等
        <el-tag>{{ levelCount.score_70 }}</el-tag>
        ； 及格
        <el-tag>{{ levelCount.score_60 }}</el-tag>
        ； 不及格
        <el-tag>{{ levelCount.score_last }}</el-tag>
        ； 共
        <el-tag>{{ levelCount.len }}</el-tag>
      </div>
      <el-table :data="currentPStudentsR">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column min-width="220">
          <template #default="scope">
            <el-text type="primary" size="large">{{ scope.row.name }}</el-text>
            <br />
            {{ scope.row.student.teacherName }}
            <br />
            {{ scope.row.student.projectTitle }}
          </template>
        </el-table-column>
        <el-table-column label="附件">
          <template #default="scope">
            <template v-for="(attach, index) of currentProcessAttach" :key="index">
              <el-button
                :icon="attach.number == 1 ? Box : Brush"
                :color="attach.number == 1 ? '#409EFF' : '#626aef'"
                style="margin-bottom: 5px"
                @click="clickAttachF(scope.row.id, attach.number!)"
                v-if="processFileC(scope.row.id, attach.number!)">
                {{ attach.name }}
              </el-button>
              <br />
            </template>
          </template>
        </el-table-column>
        <el-table-column label="评分/平均分">
          <template #default="scope">
            {{ scope.row.currentTeacherScore }} /
            <el-text type="primary" size="large">{{ scope.row.averageScore }}</el-text>
            <br />
            <span v-for="(t, index) of scope.row.psTeachers" :key="index">
              {{ t.teacherName }};
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template #default="scope">
            <el-button type="primary" @click="gradeF(scope.row)">评分</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <gradingDialog
    v-if="gradingDialogVisable"
    :student="currentStudentR!"
    :close="closeF"
    :add-process-score="addProcessScoreF"
    :processId="params.pid" />
</template>

<style scoped>
.attach:hover {
  cursor: pointer;
}
</style>
