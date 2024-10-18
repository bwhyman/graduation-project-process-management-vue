<script setup lang="ts">
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
const results = await Promise.all([
  TeacherService.listTeachersService(),
  TeacherService.listStudentsService()
])
const allTeachersR = results[0]
const allStudentsR = results[1]
const studentsTR = ref<User[]>([])
const teachersR = ref<TeacherTemp[]>([])
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
    B: teach.teacher?.total! - teach?.teacher?.A! - teach?.teacher?.C!,
    levelA: [],
    levelB: [],
    levelC: []
  }
  teachersR.value.push(temp)
})

const randomF = () => {
  const studentsA = allStudentsR.value.slice(0, totalA)
  const studentsB = allStudentsR.value.slice(totalA, allStudentsR.value.length - totalC)
  const studentsC = allStudentsR.value.slice(allStudentsR.value.length - totalC)
  teachersR.value.forEach((teach) => {
    teach.levelA = []
    teach.levelB = []
    teach.levelC = []
  })
  const teachsTemp: TeacherTemp[] = []
  studentsA.forEach((stu) => {
    let notFull = true
    while (notFull) {
      if (teachsTemp.length == 0) {
        teachsTemp.push(...teachersR.value)
      }
      let rand = Math.floor(Math.random() * teachsTemp.length)
      const teacher = teachsTemp[rand]
      if (teacher.A == 0 || teacher.levelA?.length == teacher.A) {
        teachsTemp.splice(rand, 1)
        continue
      }
      teacher.levelA?.push(stu)
      teachsTemp.splice(rand, 1)
      notFull = false
    }
  })
  studentsB.forEach((stu) => {
    let notFull = true
    while (notFull) {
      if (teachsTemp.length == 0) {
        teachsTemp.push(...teachersR.value)
      }
      let rand = Math.floor(Math.random() * teachsTemp.length)
      const teacher = teachsTemp[rand]
      if (teacher.B == 0 || teacher.levelB?.length == teacher.B) {
        teachsTemp.splice(rand, 1)
        continue
      }
      teacher.levelB?.push(stu)
      teachsTemp.splice(rand, 1)
      notFull = false
    }
  })
  studentsC.forEach((stu) => {
    let notFull = true
    while (notFull) {
      if (teachsTemp.length == 0) {
        teachsTemp.push(...teachersR.value)
      }
      let rand = Math.floor(Math.random() * teachsTemp.length)
      const teacher = teachsTemp[rand]
      if (teacher.C == 0 || teacher.levelC?.length == teacher.C) {
        teachsTemp.splice(rand, 1)
        continue
      }
      teacher.levelC?.push(stu)
      teachsTemp.splice(rand, 1)
      notFull = false
    }
  })
}

// ----------------
const submitF = async () => {
  teachersR.value.forEach((teach) => {
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
  await TeacherService.updateStudentsService(studentsTR.value)
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
  </el-row>
</template>
