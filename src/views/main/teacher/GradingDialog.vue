<script lang="ts" setup>
import { useProcessStore } from '@/stores/ProcessStore'
import { useUserStore } from '@/stores/UserStore'
import type { PSDetail, ProcessScore, StudentProcessScore } from '@/types'

const dialogVisible = ref(true)
//
interface Props {
  processId: string
  student: StudentProcessScore
  close: () => void
  addProcessScore: (ps: ProcessScore) => void
}
const props = defineProps<Props>()
const processStore = useProcessStore()
const process = processStore.processesS.find((p) => p.id == props.processId)
// 过程项
const processItems = process?.items ?? []
const userStore = useUserStore()
const currentTeacherScore = props.student.psTeachers?.find((t) => t.teacherId == userStore.userS.id)
const scoreInfoR = ref<ProcessScore>({})
const psDetailR = ref<PSDetail>({})
if (currentTeacherScore) {
  psDetailR.value = currentTeacherScore
} else {
  psDetailR.value.score = 0
  psDetailR.value.detail = []
  processItems.forEach((item) => {
    psDetailR.value.detail?.push({ score: 0, number: item.number! })
  })
}

const autoScore = ref(currentTeacherScore?.score ?? 0)
watch(autoScore, () => {
  const score = autoScore.value
  psDetailR.value.score = score
  psDetailR.value.detail?.forEach((scoreD, index) => {
    const item = processItems[index]
    scoreD.score = Math.round(score * 0.01 * item.point!)
  })
})

// ----------------------

const onFocusF = (event: FocusEvent) => {
  ;(event.target as HTMLInputElement).select()
}

const onInputF = (index: number) => {
  if (psDetailR.value.detail![index].score > processItems[index].point!) {
    psDetailR.value.detail![index].score = processItems[index].point ?? 0
  }
  let temp = 0
  psDetailR.value.detail?.forEach((d) => {
    temp += d.score
  })
  psDetailR.value.score = temp
}

// ---------------------
const submitF = () => {
  scoreInfoR.value.teacherId = userStore.userS.id
  scoreInfoR.value.studentId = props.student.id
  scoreInfoR.value.processId = props.processId
  psDetailR.value.teacherName = userStore.userS.name
  scoreInfoR.value.detail = toRaw(psDetailR.value)
  currentTeacherScore && (scoreInfoR.value.id = currentTeacherScore.processScoreId)
  props.addProcessScore(toRaw(scoreInfoR.value))
  props.close()
}
//
const onInputAutoF = () => {
  autoScore.value > 100 && (autoScore.value = 100)
}

//
const wWidth = ref(window.innerWidth)
const widthC = computed(() => {
  return wWidth.value < 768 ? '80%' : '50%'
})
</script>
<template>
  <el-dialog v-model="dialogVisible" title="Grading" :width="widthC" @close="props.close">
    <p>{{ props.student.name }}；平均分： {{ props.student.averageScore }}；</p>

    <br />
    <el-row :gutter="10">
      <el-col :span="6" style="margin-top: 5px; text-align: right">
        <span>自动分布</span>
      </el-col>
      <el-col :span="10">
        <el-input
          v-model.number="autoScore"
          style="margin-bottom: 5px"
          type="number"
          v-on:input="onInputAutoF" />
      </el-col>
    </el-row>
    <el-row :gutter="10" v-for="(p, index) of processItems" :key="index">
      <el-col :span="6" style="margin-top: 5px; text-align: right">
        <span>{{ p.name }}-{{ p.point }}</span>
      </el-col>
      <el-col :span="10">
        <el-input
          style="margin-bottom: 5px"
          type="number"
          v-on:input="onInputF(index)"
          :value="psDetailR.detail![index].score"
          v-model.number="psDetailR.detail![index].score"
          @focus="onFocusF" />
      </el-col>
    </el-row>
    <br />
    <el-row :gutter="10" style="margin-bottom: 5px">
      <el-col :span="6" style="text-align: right">
        <span>评分</span>
      </el-col>
      <el-col :span="4">
        {{ psDetailR.score }}
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="6"></el-col>
      <el-col :span="12">
        <el-button type="primary" @click="submitF">提交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
