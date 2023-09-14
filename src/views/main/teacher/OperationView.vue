<script setup lang="ts">
import { parseStudent } from '@/services/ParseUtils'
import {
  getProcessScoresService,
  getStudentsService,
  getTeachersService,
  getUnselectedStudentsService
} from '@/services/TeacherService'
import { useProcessStore } from '@/stores/ProcessStore'
import type { ProcessItem, Student, User } from '@/types/type'

const studentsR = ref<User[]>([])
const showUnSelectedR = ref(false)
const processStore = useProcessStore()
const processS = storeToRefs(processStore).processesS

const getStu = () => {
  getUnselectedStudentsService().then((result) => {
    result.students && (studentsR.value = result.students)
    showUnSelectedR.value = true
  })
}
// ------------
const exportStudents = () => {
  getStudentsService().then((res) => {
    if (!res.students) return
    let i = 0
    let result = res.students.map((s) => {
      let temp = parseStudent(s)
      return {
        序号: (i += 1),
        学号: temp.number,
        学生姓名: temp.name,
        指导教师: temp.teacherName
      }
    })
    import('@/services/ExcelUtils').then(({ exportExcelFile }) => exportExcelFile(result))
  })
}
// ----------------------
const exportGroup = async () => {
  const students = (await getStudentsService()).students
  const teachers = (await getTeachersService()).teachers
  const map = new Map<number, { students: Student[]; teachers: User[] }>()
  students?.forEach((stu) => {
    if (!stu.groupNumber) return
    let mapValue = stu.groupNumber && map.get(stu.groupNumber)
    if (!mapValue) {
      mapValue = { students: [], teachers: [] }
      map.set(stu.groupNumber, mapValue)
    }
    mapValue.students.push(stu)
  })

  teachers?.forEach((ts) => {
    if (!ts.groupNumber) return
    let mapValue = ts.groupNumber && map.get(ts.groupNumber)
    if (!mapValue) {
      mapValue = { students: [], teachers: [] }
      map.set(ts.groupNumber, mapValue)
    }
    mapValue.teachers.push(ts)
  })

  map.forEach((value) => {
    value.students.sort((s1, s2) => s1.queueNumber! - s2.queueNumber!)
  })

  import('@/services/ExcelUtils').then(({ exportGroupExcelFile }) => exportGroupExcelFile(map))
}

const exportScores = async () => {
  const students = (await getStudentsService()).students
  const processScores = (await getProcessScoresService()).ps

  import('@/services/ExcelUtils').then(({ exportScoreExcelFile }) =>
    exportScoreExcelFile(processS.value, processScores ?? [], students ?? [])
  )
}
</script>
<template>
  <el-row class="my-row">
    <div>
      <p style="margin-bottom: 10px">
        <el-button type="primary" @click="getStu">未选择学生</el-button>
        <el-button type="primary" @click="exportStudents">导出互选表格</el-button>
        <el-button type="primary" @click="exportGroup">导出分组表格</el-button>
        <template v-if="processS.length > 0">
          <el-button type="primary" @click="exportScores">导出详细成绩表格</el-button>
        </template>
      </p>

      <p v-if="showUnSelectedR">
        未选学生数:
        <el-tag type="danger">{{ studentsR.length }}</el-tag>
        <br />
        <span v-for="(st, index) in studentsR" :key="index">{{ st.name }};</span>
      </p>
    </div>
  </el-row>
</template>
