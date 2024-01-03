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
const psDetailR = ref<PSDetail>({ detail: [], score: currentTeacherScore?.score ?? 0 })

processItems.forEach((item, index) => {
  const score =
    (currentTeacherScore &&
      (currentTeacherScore?.detail as { number: number; score: number }[])[index].score) ??
    0

  psDetailR.value.detail!.push({
    number: item.number!,
    score: score
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
    psDetailR.value.score = temp
  })
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
const wWidth = ref(window.innerWidth)
// onMounted(() => {
//   wWidth.value = window.innerWidth
//   window.addEventListener('resize', () => {
//     wWidth.value = window.innerWidth
//   })
// })
// onUnmounted(() => {
//   window.removeEventListener('resize', () => {})
// })
const widthC = computed(() => {
  return wWidth.value < 768 ? '80%' : '50%'
})
</script>
<template>
  <el-dialog v-model="dialogVisible" title="Grading" :width="widthC" @close="props.close">
    <p>{{ props.student.name }}；平均分： {{ props.student.averageScore }}；</p>

    <br />
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
