<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { TeacherService } from '@/services/TeacherService'
import type { Student, StudentDTO, User } from '@/types'
import { Check } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import { exportGroup } from './GroupingView'

const result = await Promise.all([
  TeacherService.listStudentsService(),
  TeacherService.listTeachersService()
])

const groupMessageR = ref<{ group: number; length: number }[]>([])
const studentsR = result[0]
const teachersR = result[1]
const disbR = ref(0)
let groupNumber = -1

// 新分组
const newStuGroupMap = ref(
  new Map<number, { students: User[]; total: number; teacherCount: Map<string, number> }>()
)
//
const currentGroupStudentsR = ref<{
  students: User[]
  total: number
  teacherCount: Map<string, number>
}>()
//
const activeNameR = ref('0')

// 学生按导师分组
const teacherGroupMap = new Map<number, User[]>()
teachersR.value.forEach((t) => (groupNumber = Math.max(groupNumber, t.groupNumber ?? 0)))
for (let index = 1; index <= groupNumber; index++) {
  teacherGroupMap.set(index, [])
  newStuGroupMap.value.set(index, {
    students: [],
    total: 0,
    teacherCount: new Map<string, number>()
  })
}
studentsR.value.forEach((st) => {
  const tid = st.student?.teacherId
  // 当前学生教师所在组
  const teacherGroup = teachersR.value.find((teach) => teach.id == tid)?.groupNumber ?? 0
  teacherGroupMap.get(teacherGroup)?.push(st)
})

const grouping = () => {
  groupMessageR.value = []
  disbR.value = 0
  newStuGroupMap.value.clear()

  // 初始化
  for (let index = 1; index <= groupNumber; index++) {
    // 随机向上或向下取整。随机组学生数
    const rand = Math.floor(Math.random() * 2)
    let groupTotalTemp =
      rand == 0
        ? Math.floor(studentsR.value.length / groupNumber)
        : Math.ceil(studentsR.value.length / groupNumber)

    if (index == groupNumber) {
      let t = 0
      newStuGroupMap.value.forEach((value) => {
        t += value.total
      })
      groupTotalTemp = studentsR.value.length - t
    }
    newStuGroupMap.value.set(index, {
      students: [],
      total: groupTotalTemp,
      teacherCount: new Map<string, number>()
    })
  }

  //
  teacherGroupMap.forEach((stus, key) => {
    stus.forEach((stu) => {
      let randGroup = -1
      let stop = true
      while (stop) {
        randGroup = Math.ceil(Math.random() * groupNumber)
        if (randGroup != key) {
          newStuGroupMap.value.get(randGroup)?.students.push(stu)
          stu.groupNumber = randGroup
          stop = false
        }
      }
    })
  })

  const mapTemp = new Map(newStuGroupMap.value)
  const mapTemp2 = new Map<number, { students: User[]; total: number }>()
  for (let i = 1; i <= groupNumber; i++) {
    let maxLength = { len: -1, key: -1 }
    mapTemp.forEach((value, key) => {
      const len = value.students.length
      if (len > maxLength.len) {
        maxLength.len = len
        maxLength.key = key
      }
    })
    mapTemp2.set(maxLength.key, mapTemp.get(maxLength.key)!)
    mapTemp.delete(maxLength.key)
  }

  mapTemp2.forEach((value, key) => {
    let stop = true
    while (stop) {
      if (value.students.length > value.total) {
        const stu = value.students[0]
        const teacherGroup =
          teachersR.value.find((teach) => teach.id == stu.student?.teacherId)?.groupNumber ?? 0
        let toGroup = -1
        for (let i = 1; i <= groupNumber; i++) {
          if (
            i == key ||
            i == teacherGroup ||
            mapTemp2.get(i)?.students.length! >= mapTemp2.get(i)?.total!
          ) {
            continue
          }
          toGroup = i
        }
        mapTemp2.get(toGroup)?.students.push(stu)
        value.students.splice(0, 1)
      } else {
        stop = false
      }
    }
  })
  function shuffle(users: Student[]) {
    let j, x, i
    for (i = users.length; i; i--) {
      j = Math.floor(Math.random() * i)
      x = users[i - 1]
      users[i - 1] = users[j]
      users[i - 1].queueNumber = i
      users[j] = x
    }
    return users
  }
  for (let i = 1; i <= groupNumber; i++) {
    const stus = newStuGroupMap.value.get(i)?.students as Student[]
    shuffle(stus)
    const len = mapTemp2.get(i)?.students.length!
    disbR.value += len
    groupMessageR.value.push({ group: i, length: len })
  }

  newStuGroupMap.value.forEach((stuG) => {
    stuG.students.forEach((stu) => {
      const teachName = stu.student?.teacherName
      if (!teachName) return
      let count = stuG.teacherCount.get(teachName)
      if (!count) {
        stuG.teacherCount.set(teachName, 1)
      } else {
        stuG.teacherCount.set(teachName, ++count)
      }
    })
  })

  activeNameR.value = '0'
  currentGroupStudentsR.value?.students && (currentGroupStudentsR.value.students = [])
}

// -----------
const updateGroupF = async () => {
  const students: StudentDTO[] = []
  newStuGroupMap.value.forEach((value, key) => {
    for (let i = 0; i < value.students.length!; i++) {
      const stu: StudentDTO = {
        number: value.students[i].number,
        groupNumber: key,
        queueNumber: i + 1
      }
      students.push(stu)
    }
  })
  await TeacherService.updateStudentsGroupsService(students)
  createElNotificationSuccess('更新学生分组成功')
}
//
const exportGroupF = async () => {
  const students = await TeacherService.listStudentsService()
  exportGroup(students.value)
}
//

const handleClick = (tab: TabsPaneContext) => {
  const index = Number.parseInt(tab.index!) + 1
  currentGroupStudentsR.value = newStuGroupMap.value.get(index)
}
</script>
<template>
  <el-row class="my-row">
    <el-col class="my-col" :span="6">
      <el-button @click="grouping" type="primary">随机分组/乱序</el-button>
      <el-button
        v-if="studentsR.length != 0"
        type="success"
        :icon="Check"
        :disabled="!(studentsR.length == disbR)"
        @click="updateGroupF"></el-button>
    </el-col>
    <el-col class="my-col" :span="6">
      <el-button type="primary" @click="exportGroupF">导出分组表格</el-button>
    </el-col>
    <el-col class="my-col">
      <p>学生总数与分配数相同时，可提交</p>
      <p>
        学生总数：{{ studentsR.length }}; 分配数：{{ disbR }}
        <br />
        <span v-for="(temp, index) in groupMessageR" :key="index">
          第{{ temp.group ?? 0 }}组: {{ temp.length ?? 0 }};
        </span>
      </p>
    </el-col>
    <!--  -->
    <el-col class="my-col">
      <el-tabs v-model="activeNameR" @tab-click="handleClick">
        <el-tab-pane
          v-for="(group, index) of newStuGroupMap"
          :label="`第${index + 1}组`"
          :name="index"
          :key="index">
          <template v-for="(tc, index3) of currentGroupStudentsR?.teacherCount" :key="index3">
            {{ tc }}
          </template>
          <br />
          <template v-for="(student, index2) of currentGroupStudentsR?.students" :key="index2">
            {{ index2 + 1 }} - {{ student.name }} - {{ student.student?.teacherName }}
            <br />
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
