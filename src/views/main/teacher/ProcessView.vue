<script setup lang="ts">
import {
  listProcessScoresService,
  addPorcessScore,
  listPorcessFilesService,
  getProcessFile
} from '@/services/TeacherService'
import { usePSDetailsStore } from '@/stores/PSDetailsStore'
import { useUserStore } from '@/stores/UserStore'
import type { PSDetail, ProcessFile } from '@/types/type'
import { Link } from '@element-plus/icons-vue'

const props = defineProps<{ pid: string; auth: string }>()

listProcessScoresService(props.pid, props.auth)

const processFilesR = ref<ProcessFile[]>([])

listPorcessFilesService(props.pid).then((pfs) => {
  pfs && (processFilesR.value = pfs)
})

const processFileC = computed(
  () => (sid: string) => processFilesR.value.find((pf) => pf.studentId == sid)
)

const userStore = useUserStore()
const userR = storeToRefs(userStore).userS

const psdetailsStore = usePSDetailsStore()
const psDetailsMap = storeToRefs(psdetailsStore).psDetailsMap
const reviewScore = ref(0)
// 当前登录评审打分
const tutorScoreC = computed(
  () => (psd: PSDetail) => psd.teachers?.find((t) => t.teacherId == userR.value.id)?.score
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
    len = psDetailsMap.value.get(props.pid)?.length ?? 0
  psDetailsMap.value.get(props.pid)?.forEach((psd) => {
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

const addProcessScoreF = (row: PSDetail, event: KeyboardEvent) => {
  const se: { score: number; processId: string; studentId: string; teacherName: string } = {
    studentId: row.studentId ?? '',
    processId: props.pid,
    score: reviewScore.value,
    teacherName: userR.value.name ?? ''
  }
  addPorcessScore(se)
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
      <el-table :data="psDetailsMap.get(props.pid)">
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
              v-if="processFileC(scope.row.sid)"
              @click="clickAttachF(processFileC(scope.row.sid)?.detail ?? '')">
              <Link />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="平均分">
          <template #default="scope">
            {{ scope.row.score }} / {{ scope.row.teachers.length }}
            <br />
            <span v-for="(t, index) of scope.row.teachers" :key="index">{{ t.teacherName }};</span>
          </template>
        </el-table-column>
        <el-table-column label="评分">
          <template #default="scope">
            <el-input
              @keyup.enter="addProcessScoreF(scope.row, $event)"
              :value="tutorScoreC(scope.row)"
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
