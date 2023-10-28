<script setup lang="ts">
import {
  addPorcessScoreService,
  listPorcessFilesService,
  getProcessFileService,
  listProcessScoresService,
  getInfosService
} from '@/services/TeacherService'
import { useUserStore } from '@/stores/UserStore'
import type {
  StudentProcessScore,
  PSDetail,
  PSDetailTeacher,
  ProcessFile,
  ProcessScore
} from '@/types/type'
import { Link } from '@element-plus/icons-vue'
import { PA_REVIEW } from '@/services/Const'
import GroupTeacherView from './GroupTeacherView.vue'

const gradingDialog = defineAsyncComponent(() => import('./GradingDialog.vue'))
const currentStudentR = ref<StudentProcessScore>()

const gradingDialogVisable = ref(false)
const gradeF = (s: StudentProcessScore) => {
  gradingDialogVisable.value = true
  currentStudentR.value = s
}
// 传给子组件
const closeF = () => (gradingDialogVisable.value = false)
// --------------------

const props = defineProps<{ pid: string; auth: string }>()
const processFilesR = ref<ProcessFile[]>([])
const userStore = useUserStore()

// 聚合评分数据
const collectPS = (pses: ProcessScore[]) => {
  ;(currentPStudentsR as StudentProcessScore[]).forEach((stuD) => {
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
      if (ps.teacherId == userStore.userS.id) {
        stuD.currentTeacherScore = psDetail.score
      }
    })
    stuD.averageScore = temp / stuD.psTeachers.length
    stuD.averageScore = ~~(stuD.averageScore * 100) / 100
  })
}

const result = await Promise.all([
  getInfosService(),
  listProcessScoresService(props.pid, props.auth),
  listPorcessFilesService(props.pid, props.auth)
])

const currentPStudentsR: StudentProcessScore[] =
  props.auth == PA_REVIEW ? result[0].groupStudentsS : result[0].tutortudentsS

collectPS(result[1])
processFilesR.value = result[2]

const processFileC = computed(
  () => (sid: string) => processFilesR.value.find((pf) => pf.studentId == sid)
)

const scoreCountsC = computed<{
  score_90: number
  score_80: number
  score_70: number
  score_60: number
  score_last: number
  len: number
}>(() => {
  let sc_90 = 0,
    sc_80 = 0,
    sc_70 = 0,
    sc_60 = 0,
    sc_last = 0,
    len = currentPStudentsR.length ?? 0

  currentPStudentsR.forEach((psd) => {
    const stand = 89.5
    if (!psd.averageScore || psd.averageScore < stand - 30) {
      sc_last++
      return
    }

    if (psd.averageScore >= stand) {
      sc_90++
      return
    } else if (psd.averageScore >= stand - 10 && psd.averageScore < stand) {
      sc_80++
      return
    } else if (psd.averageScore >= stand - 20 && psd.averageScore < stand - 10) {
      sc_70++
      return
    } else if (psd.averageScore >= stand - 30 && psd.averageScore < stand - 20) {
      sc_60++
      return
    }
  })
  return {
    score_90: sc_90,
    score_80: sc_80,
    score_70: sc_70,
    score_60: sc_60,
    score_last: sc_last,
    len: len
  }
})

// ---------------------
const addProcessScoreF = (ps: ProcessScore) => {
  addPorcessScoreService(ps, props.auth).then((pses) => collectPS(pses))
}

const clickAttachF = (pname: string) => {
  getProcessFileService(pname)
}
// ------------------------
</script>
<template>
  <GroupTeacherView />
  <el-row class="my-row">
    <el-col style="margin-bottom: 10px">
      <div>
        优秀
        <el-tag>{{ scoreCountsC.score_90 }}</el-tag>
        ； 良好
        <el-tag>{{ scoreCountsC.score_80 }}</el-tag>
        ； 中等
        <el-tag>{{ scoreCountsC.score_70 }}</el-tag>
        ； 及格
        <el-tag>{{ scoreCountsC.score_60 }}</el-tag>
        ； 不及格
        <el-tag>{{ scoreCountsC.score_last }}</el-tag>
        ； 共
        <el-tag>{{ scoreCountsC.len }}</el-tag>
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
            <el-icon
              class="attach"
              :size="24"
              color="red"
              v-if="processFileC(scope.row.id)"
              @click="clickAttachF(processFileC(scope.row.id)?.detail ?? '')">
              <Link />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="评分/平均分">
          <template #default="scope">
            {{ scope.row.currentTeacherScore }} / {{ scope.row.averageScore }}
            <br />
            <span v-for="(t, index) of scope.row.psTeachers" :key="index">
              {{ t.teacherName }};
            </span>
          </template>
        </el-table-column>
        <el-table-column label="打分">
          <template #default="scope">
            <el-button type="primary" @click="gradeF(scope.row)">打分</el-button>
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
    :processId="props.pid" />
</template>

<style scoped>
.attach:hover {
  cursor: pointer;
}
</style>
