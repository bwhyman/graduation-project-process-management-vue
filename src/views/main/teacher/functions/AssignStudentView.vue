<script setup lang="ts">
import { createElLoading } from '@/components/loading'
import { createElNotificationSuccess } from '@/components/message'
import { TeacherService } from '@/services/TeacherService'
import type { User } from '@/types'
import { Check } from '@element-plus/icons-vue'

interface TeacherTemp {
  id?: string
  name?: string
  total?: number
  A?: number
  B?: number
  C?: number
  levelA?: User[]
  levelB?: User[]
  levelC?: User[]
}
const allTeachersR = await TeacherService.listTeachersService()
const allStudentsR = await TeacherService.listStudentsService()
const studentsTR = ref<User[]>([])
const teachersR = ref<TeacherTemp[]>([])
const studentsAmount = ref(0)
let totalA = 0
let totalC = 0

allTeachersR.value.forEach((teach) => {
  totalA += teach.teacher?.A ?? 0
  totalC += teach.teacher?.C ?? 0
  const temp = {
    id: teach.id,
    name: teach.name,
    total: teach.teacher?.total,
    A: teach.teacher?.A,
    C: teach.teacher?.C,
    levelA: [],
    levelB: [],
    levelC: []
  }
  teachersR.value.push(temp)
})

const randomF = () => {
  teachersR.value.forEach((teach) => {
    teach.levelA = []
    teach.levelB = []
    teach.levelC = []
  })
  studentsAmount.value = 0

  const students = allStudentsR.value

  // A
  let studentsTemp = students.concat()
  let teachersTemp = teachersR.value.concat().filter((teach) => teach.A != 0)
  for (let i = 0; i < totalA; i++) {
    if (teachersTemp.length == 0) {
      teachersTemp = teachersR.value.concat().filter((teach) => teach.A != 0)
    }
    let rand = Math.floor(Math.random() * teachersTemp.length)
    const currentTeacher = teachersTemp[rand]
    currentTeacher.levelA?.push(studentsTemp[i])
    teachersTemp.splice(rand, 1)
  }

  // C
  studentsTemp = students.reverse()
  teachersTemp = teachersR.value.concat().filter((teach) => teach.C != 0)
  for (let i = 0; i < totalC; i++) {
    if (teachersTemp.length == 0) {
      teachersTemp = teachersR.value.concat().filter((teach) => teach.C != 0)
    }
    let rand = Math.floor(Math.random() * teachersTemp.length)
    const currentTeacher = teachersTemp[rand]
    currentTeacher.levelC?.push(studentsTemp[i])
    teachersTemp.splice(rand, 1)
  }

  // B
  studentsTemp = students.reverse().concat()
  teachersTemp = teachersR.value.concat().filter((teach) => teach.B != 0)
  for (let i = totalA; i < students.length! - totalC; i++) {
    let stop = true
    while (stop) {
      let rand = Math.floor(Math.random() * teachersR.value.length)
      const currentTeacher = teachersR.value[rand]
      const t =
        currentTeacher.levelA?.length! +
        currentTeacher.levelB?.length! +
        currentTeacher.levelC?.length!
      if (currentTeacher.total! > t) {
        currentTeacher.levelB?.push(studentsTemp[i])
        stop = false
      }
      if (t >= currentTeacher.total!) {
        teachersTemp.splice(rand, 1)
      }
    }
  }

  studentsTR.value.length = 0
  teachersR.value.forEach((teach) => {
    studentsAmount.value += teach.levelA?.length! + teach.levelB?.length! + teach.levelC?.length!
    teach.levelA?.forEach((stu) => {
      studentsTR.value.push({
        name: stu.name,
        number: stu.number,
        student: { teacherId: teach.id, teacherName: teach.name }
      })
    })
    teach.levelB?.forEach((stu) => {
      studentsTR.value.push({
        name: stu.name,
        number: stu.number,
        student: { teacherId: teach.id, teacherName: teach.name }
      })
    })
    teach.levelC?.forEach((stu) => {
      studentsTR.value.push({
        name: stu.name,
        number: stu.number,
        student: { teacherId: teach.id, teacherName: teach.name }
      })
    })
  })
}

// ----------------
const submitF = async () => {
  const loading = createElLoading()
  await TeacherService.updateStudentsService(studentsTR.value)
  loading.close()
  createElNotificationSuccess('学生分配提交成功')
}
//
const exportStudents = () => {
  TeacherService.listStudentsService().then((res) => {
    if (!res) return
    let i = 0
    let result = res.value.map((s) => {
      return {
        序号: (i += 1),
        学号: s.number,
        学生姓名: s.name,
        指导教师: s.student?.teacherName
      }
    })
    import('@/services/ExcelUtils').then(({ exportExcelFile }) => exportExcelFile(result))
  })
}
</script>
<template>
  <el-row class="my-row">
    <el-col class="my-col" :span="6">
      <el-button type="primary" @click="randomF">随机分配</el-button>
      <el-button @click="submitF" type="success" :icon="Check"></el-button>
    </el-col>
    <el-col class="my-col" :span="4">
      <el-button type="primary" @click="exportStudents">导出分配表格</el-button>
    </el-col>
    <el-col class="my-col">
      <template v-for="(t, index) of teachersR" :key="index">
        {{ t.name }}/ {{ t.total }}:
        <br />
        LevelA:
        <template v-for="(stu, index) of t.levelA" :key="index">{{ stu.name }};</template>
        LevelB:
        <template v-for="(stu, index) of t.levelB" :key="index">{{ stu.name }};</template>
        LevelC:
        <template v-for="(stu, index) of t.levelC" :key="index">{{ stu.name }};</template>
        <br />
      </template>
      <br />
    </el-col>
    <!-- <el-col class="my-col">
      <GroupingView :students="studentsTR" :teachers="allTeachersR" />
    </el-col> -->
  </el-row>
</template>
