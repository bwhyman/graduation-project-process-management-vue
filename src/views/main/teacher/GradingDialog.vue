<script lang="ts" setup>
import { CommonService } from '@/services'
import { useUserStore } from '@/stores/UserStore'
import type { PSDetail, ProcessScore, StudentProcessScore } from '@/types'
const userStore = useUserStore()
const dialogVisible = ref(true)
//
interface Props {
  processId: string
  student: StudentProcessScore
  close: () => void
  addProcessScore: (ps: ProcessScore) => void
}
const props = defineProps<Props>()
const processesS = await CommonService.listProcessesService()
const process = processesS.value.find((p) => p.id == props.processId)
// 过程项
const processItems = process?.items ?? []
const userS = userStore.userS
const currentTeacherScore = props.student.psTeachers?.find((t) => t.teacherId == userS.value!.id)
const scoreInfoR = ref<ProcessScore>({})
const psDetailR = ref<PSDetail>({})
if (currentTeacherScore) {
  psDetailR.value = JSON.parse(JSON.stringify(toRaw(currentTeacherScore)))
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
  if (!psDetailR.value.detail) return
  // 基于随机数计算项得分
  let temp = 0
  const psDetailTemp = [...psDetailR.value.detail]
  while (psDetailTemp.length > 1) {
    const randomIndex = Math.floor(Math.random() * psDetailTemp.length)
    const psDetail = psDetailTemp[randomIndex]
    const item = processItems.find((pi) => pi.number === psDetail.number)
    const result = score * 0.01 * (item?.point ?? 0)
    const randomScore = Math.random() > 0.5 ? Math.ceil(result) : Math.floor(result)
    psDetail.score = randomScore
    psDetailTemp.splice(randomIndex, 1)
    temp += randomScore
  }
  // 最后一项填充剩余分数
  psDetailTemp[0].score = score - temp
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
  if (!userS.value) return
  scoreInfoR.value.teacherId = userS.value.id
  scoreInfoR.value.studentId = props.student.student?.id
  scoreInfoR.value.processId = props.processId
  psDetailR.value.teacherName = userS.value.name
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
    <el-row :gutter="10" class="row">
      <el-col :span="6" class="col-title">
        <el-text type="primary" size="large">{{ props.student.student?.name }}</el-text>
        平均分
      </el-col>
      <el-col :span="10">
        <el-text type="primary" size="large">{{ props.student.averageScore }}</el-text>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="row">
      <el-col :span="6" class="col-title">自动分配评分</el-col>
      <el-col :span="10">
        <el-input
          v-model.number="autoScore"
          type="number"
          @input="onInputAutoF"
          @keyup.enter="submitF" />
      </el-col>
    </el-row>
    <el-row :gutter="10" class="row" v-for="(p, index) of processItems" :key="index">
      <el-col :span="6" class="col-title">{{ p.name }}-{{ p.point }}</el-col>
      <el-col :span="10">
        <el-input
          type="number"
          v-on:input="onInputF(index)"
          :value="psDetailR.detail![index].score"
          v-model.number="psDetailR.detail![index].score"
          @focus="onFocusF" />
      </el-col>
    </el-row>
    <br />
    <el-row :gutter="10" class="row">
      <el-col :span="6" class="col-title">评分</el-col>
      <el-col :span="4">
        <el-text type="primary" size="large">{{ psDetailR.score }}</el-text>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="row">
      <el-col :span="6"></el-col>
      <el-col :span="12">
        <el-button type="primary" @click="submitF">提交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<style scoped>
.row {
  margin-bottom: 5px;
  align-items: center;
}
.col-title {
  text-align: right;
}
</style>
