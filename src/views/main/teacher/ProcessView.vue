<script setup lang="ts">
import {
  addPorcessScore,
  listPorcessFilesService,
  getProcessFile,
  listProcessScoresService
} from '@/services/TeacherService'
import { useUserStore } from '@/stores/UserStore'
import type { PSDetailTeacher, ProcessFile, ProcessScore, Student } from '@/types/type'
import { useGroupInfosStore } from '@/stores/GroupInfosStore'
import { Link } from '@element-plus/icons-vue'
import { PA_REVIEW } from '@/services/Const'

interface PSDetail extends Student {
  score?: number
  psTeachers?: PSDetailTeacher[]
  teacherScore?: number
}
const props = defineProps<{ pid: string; auth: string }>()
const processFilesR = ref<ProcessFile[]>([])
const groupInfosStore = useGroupInfosStore()
const userStore = useUserStore()
const userR = storeToRefs(userStore).userS

const currentPStudentsR: Ref<PSDetail[]> =
  props.auth == PA_REVIEW
    ? storeToRefs(groupInfosStore).groupStudentsS
    : storeToRefs(groupInfosStore).tutortudentsS

watch(
  currentPStudentsR,
  () => {
    if (currentPStudentsR.value.length > 0) {
      listProcessScoresService(props.pid, props.auth).then((pses) => {
        pses && collectPS(pses)
      })
    }
  },
  { immediate: true }
)

// 聚合评分数据
const collectPS = (pses: ProcessScore[]) => {
  ;(currentPStudentsR.value as PSDetail[]).forEach((stuD) => {
    let temp = 0
    let tScore
    stuD.psTeachers = []
    stuD.score = temp
    stuD.teacherScore = tScore

    const teachDs = pses.find((ps) => ps.studentId == stuD.id)
    if (!teachDs) return
    stuD.psTeachers = teachDs.detail as PSDetailTeacher[]

    stuD.psTeachers.forEach((t) => {
      temp += t.score
      if (t.teacherId == userR.value.id) {
        stuD.teacherScore = t.score
      }
    })
    stuD.score = temp / stuD.psTeachers.length
    stuD.score = ~~(stuD.score * 100) / 100
  })
}

listPorcessFilesService(props.pid, props.auth).then((pfs) => {
  pfs && (processFilesR.value = pfs)
})

const processFileC = computed(
  () => (sid: string) => processFilesR.value.find((pf) => pf.studentId == sid)
)

const reviewScore = ref(0)

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
    len = currentPStudentsR.value.length ?? 0

  currentPStudentsR.value.forEach((psd) => {
    const stand = 89.5
    if (!psd.score || psd.score < stand - 30) {
      sc_last++
      return
    }

    if (psd.score >= stand) {
      sc_90++
      return
    } else if (psd.score >= stand - 10 && psd.score < stand) {
      sc_80++
      return
    } else if (psd.score >= stand - 20 && psd.score < stand - 10) {
      sc_70++
      return
    } else if (psd.score >= stand - 30 && psd.score < stand - 20) {
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

const addProcessScoreF = (row: Student, event: KeyboardEvent) => {
  const se: { score: number; processId: string; studentId: string; teacherName: string } = {
    studentId: row.id ?? '',
    processId: props.pid,
    score: reviewScore.value,
    teacherName: userR.value.name ?? ''
  }
  addPorcessScore(se, props.auth).then((pses) => collectPS(pses))
  ;(event.target as HTMLInputElement)?.blur()
}

const clickAttachF = (pname: string) => {
  getProcessFile(pname)
}
</script>
<template>
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
            {{ scope.row.teacherName }}
            <br />
            {{ scope.row.projectTitle }}
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
        <el-table-column label="平均分">
          <template #default="scope">
            {{ scope.row.score }} /
            {{ scope.row.psTeachers && scope.row.psTeachers.length }}
            <br />
            <span v-for="(t, index) of scope.row.psTeachers" :key="index">
              {{ t.teacherName }};
            </span>
          </template>
        </el-table-column>
        <el-table-column label="评分">
          <template #default="scope">
            <el-input
              @keyup.enter="addProcessScoreF(scope.row, $event)"
              :value="scope.row.teacherScore"
              v-model.number="reviewScore"
              style="width: 70px"
              type="number"
              oninput="if(value > 100) value=100" />
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<style scoped>
.attach:hover {
  cursor: pointer;
}
</style>
