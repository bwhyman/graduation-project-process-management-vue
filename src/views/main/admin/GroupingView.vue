<script setup lang="ts">
import { getGroupInfo, updateGroupAndQueue } from '@/services/AdminService'
import type { Student, Teacher, User } from '@/types/type'
import { Check } from '@element-plus/icons-vue'

const groupMessageR = ref<{ group: number; length: number }[]>([])
const studentsR = ref<Student[]>([])
const teachersR = ref<Teacher[]>([])
const groupAverageR = ref('')
let groupNumber = -1
const active = () => {
  if (studentsR.value.length == 0) {
    getGroupInfo().then(({ students, teachers }) => {
      studentsR.value = students ?? []
      teachersR.value = teachers ?? []
      grouping()
    })
    return
  }
  grouping()
  return
}

const grouping = () => {
  groupMessageR.value = []
  // 总共的组数
  groupNumber = -1
  teachersR.value.forEach((t) => (groupNumber = Math.max(groupNumber, t.groupNumber ?? 0)))
  // 平均每组数量。向上取整
  const x = Math.floor(studentsR.value.length / groupNumber)
  groupAverageR.value = `${x} * ${groupNumber} + ${studentsR.value.length - x * groupNumber}`

  // 学生按导师分组
  const teacherGroupMap = new Map<number, User[]>()
  // 新分组
  const newStuGroupMap = new Map<number, User[]>()
  for (let index = 1; index <= groupNumber; index++) {
    teacherGroupMap.set(index, [])
    newStuGroupMap.set(index, [])
  }
  studentsR.value.forEach((st) => {
    const tid = st.teacherId
    // 当前学生教师所在组
    const teacherGroup = teachersR.value.find((teach) => teach.id == tid)?.groupNumber ?? 0
    teacherGroupMap.get(teacherGroup)?.push(st)
  })
  const getRandom = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //含最大最小值
  }

  teacherGroupMap.forEach((stus, key) => {
    stus.forEach((stu) => {
      let randGroup = -1
      let stop = true
      while (stop) {
        randGroup = getRandom(1, groupNumber)
        if (randGroup != key) {
          newStuGroupMap.get(randGroup)?.push(stu)
          stu.groupNumber = randGroup
          stop = false
        }
      }
    })
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

  newStuGroupMap.forEach((users, key) => {
    newStuGroupMap.set(key, shuffle(users))
    groupMessageR.value.push({ group: key, length: users.length })
  })
}
// 方法好笨
// 如果有小组学生数小于下取值，或大于上取值。重新分组
watch(groupMessageR, () => {
  const g = groupMessageR.value.find(
    (gm) =>
      gm.length < Math.floor(studentsR.value.length / groupNumber) ||
      gm.length > Math.ceil(studentsR.value.length / groupNumber)
  )
  g && grouping()
})

const updateGroup = () => {
  const stus: { number: string; groupNumber: number; queueNumber: number }[] = []
  studentsR.value.forEach((stu) =>
    stus.push({
      number: stu.number ?? '',
      groupNumber: stu.groupNumber ?? 0,
      queueNumber: stu.queueNumber ?? 0
    })
  )

  updateGroupAndQueue(stus)
}
</script>
<template>
  <el-button @click="active" type="primary">随机分组/乱序</el-button>
  <el-button
    type="success"
    :icon="Check"
    :disabled="studentsR.length == 0"
    @click="updateGroup"></el-button>
  <div v-if="groupMessageR.length > 0">
    学生总数：{{ studentsR.length }}; 平均数：{{ groupAverageR }}
    <br />
    <span v-for="(temp, index) in groupMessageR" :key="index">
      第{{ temp.group ?? 0 }}组: {{ temp.length ?? 0 }};
    </span>
  </div>
</template>
