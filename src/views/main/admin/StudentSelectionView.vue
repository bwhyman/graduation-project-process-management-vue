<script setup lang="ts">
import { addStudents, listTeachersService } from '@/services/AdminService'
import { readStudentForSelectionFile } from '@/services/ExcelUtils'
import type { User } from '@/types/type'
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
const studentsT: User[] = []
const teachersR = ref<TeacherTemp[]>([])
const studentsAmount = ref(0)
let totalA = 0
let totalC = 0

const readStu = async (event: Event) => {
  const element = event.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  if (teachersR.value.length == 0) {
    const { teachers } = await listTeachersService()

    teachers?.forEach((teach) => {
      totalA += teach.A!
      totalC += teach.C!
      teachersR.value.push({
        id: teach.id,
        name: teach.name,
        total: teach.total,
        A: teach.A,
        C: teach.C,
        levelA: [],
        levelB: [],
        levelC: []
      })
    })
  }

  readStudentForSelectionFile(element.files![0]).then((students) => {
    teachersR.value.forEach((teach) => {
      teach.levelA = []
      teach.levelB = []
      teach.levelC = []
    })
    studentsAmount.value = 0

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

    studentsT.length = 0
    teachersR.value.forEach((teach) => {
      studentsAmount.value += teach.levelA?.length! + teach.levelB?.length! + teach.levelC?.length!
      teach.levelA?.forEach((stu) => {
        studentsT.push({
          name: stu.name,
          number: stu.number,
          student: { teacherId: teach.id, teacherName: teach.name }
        })
      })
      teach.levelB?.forEach((stu) => {
        studentsT.push({
          name: stu.name,
          number: stu.number,
          student: { teacherId: teach.id, teacherName: teach.name }
        })
      })
      teach.levelC?.forEach((stu) => {
        studentsT.push({
          name: stu.name,
          number: stu.number,
          student: { teacherId: teach.id, teacherName: teach.name }
        })
      })
    })
  })
  element.value = ''
}

// ----------------
const submitF = () => {
  studentsT.sort((x, y) => Number(x.number) - Number(y.number))
  addStudents(studentsT)
}
</script>
<template>
  读取学生表格并按成绩自动分配教师：
  <input type="file" @change="readStu" />
  <br />
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
  <template v-if="studentsAmount > 0">
    <el-button @click="submitF" type="primary">提交</el-button>
    学生数：{{ studentsAmount }}
  </template>
</template>
