<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { getGroupInfo, updateGroupAndQueue } from '@/services/AdminService'
import type { Student, Teacher, User } from '@/types'
import { Check } from '@element-plus/icons-vue'

const groupMessageR = ref<{ group: number; length: number }[]>([])
const studentsR = ref<Student[]>([])
const teachersR = ref<Teacher[]>([])
const disbR = ref(0)
let groupNumber = -1
// 学生按导师分组
const teacherGroupMap = new Map<number, User[]>()
// 新分组
let newStuGroupMap = new Map<number, { students: User[]; total: number }>()
const active = async () => {
  if (studentsR.value.length == 0) {
    const { students, teachers } = await getGroupInfo()
    studentsR.value = students ?? []
    teachersR.value = teachers ?? []
    teachersR.value.forEach((t) => (groupNumber = Math.max(groupNumber, t.groupNumber ?? 0)))
    for (let index = 1; index <= groupNumber; index++) {
      teacherGroupMap.set(index, [])
      newStuGroupMap.set(index, { students: [], total: 0 })
    }

    studentsR.value.forEach((st) => {
      const tid = st.teacherId
      // 当前学生教师所在组
      const teacherGroup = teachersR.value.find((teach) => teach.id == tid)?.groupNumber ?? 0
      teacherGroupMap.get(teacherGroup)?.push(st)
    })
  }
  // ----
  grouping()
}

const grouping = () => {
  groupMessageR.value = []
  disbR.value = 0
  newStuGroupMap.clear()
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
      newStuGroupMap.forEach((value) => {
        t += value.total
      })
      groupTotalTemp = studentsR.value.length - t
    }
    newStuGroupMap.set(index, { students: [], total: groupTotalTemp })
  }

  //
  teacherGroupMap.forEach((stus, key) => {
    stus.forEach((stu) => {
      let randGroup = -1
      let stop = true
      while (stop) {
        randGroup = Math.ceil(Math.random() * groupNumber)
        if (randGroup != key) {
          newStuGroupMap.get(randGroup)?.students.push(stu)
          stu.groupNumber = randGroup
          stop = false
        }
      }
    })
  })

  const mapTemp = new Map(newStuGroupMap)
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
        const stu = value.students[0] as Student
        const teacherGroup =
          teachersR.value.find((teach) => teach.id == stu.teacherId)?.groupNumber ?? 0
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
    const stus = newStuGroupMap.get(i)?.students as Student[]
    shuffle(stus)
    const len = mapTemp2.get(i)?.students.length!
    disbR.value += len
    groupMessageR.value.push({ group: i, length: len })
  }
}

// -----------
const updateGroup = async () => {
  const stus: { number: string; groupNumber: number; queueNumber: number }[] = []
  newStuGroupMap.forEach((value, key) => {
    for (let i = 0; i < value.students.length!; i++) {
      stus.push({
        number: value.students[i].number ?? '',
        groupNumber: key,
        queueNumber: i
      })
    }
  })
  await updateGroupAndQueue(stus)
  createElNotificationSuccess('更新学生分组成功')
}
</script>
<template>
  <el-button @click="active" type="primary">随机分组/乱序</el-button>
  <el-button
    v-if="studentsR.length != 0"
    type="success"
    :icon="Check"
    :disabled="!(studentsR.length == disbR)"
    @click="updateGroup"></el-button>

  <div v-if="groupMessageR.length > 0">
    <p>学生总数与分配数相同时，可提交</p>
    <p>
      学生总数：{{ studentsR.length }}; 分配数：{{ disbR }}
      <br />
      <span v-for="(temp, index) in groupMessageR" :key="index">
        第{{ temp.group ?? 0 }}组: {{ temp.length ?? 0 }};
      </span>
    </p>
  </div>
</template>
