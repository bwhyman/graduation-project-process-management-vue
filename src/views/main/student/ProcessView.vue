<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import { useProcessStore } from '@/stores/ProcessStore'
import type { Process, ProcessFile, StudentAttach } from '@/types'
import {
  listProcessFilesService,
  uploadFileSignatureService,
  uploadFileService
} from '@/services/StudentService'
import { useUserStore } from '@/stores/UserStore'
import { createElNotificationSuccess, createMessageDialog } from '@/components/message'
import { GoldMedal, WarningFilled } from '@element-plus/icons-vue'

const props = defineProps<{ pid: string }>()

const processFilesR = ref<ProcessFile[]>([])
processFilesR.value = await listProcessFilesService(props.pid)

const showCheckedC = computed(
  () => (attach: StudentAttach) => processFilesR.value.find((pf) => pf.number == attach.number)
)

const processStore = useProcessStore()
const studentPR = ref<Process>()
watch(
  props,
  () => {
    studentPR.value = processStore.processesS.find((sp) => sp.id == props.pid)
  },
  { immediate: true }
)
const selectAttachR = ref<StudentAttach>()
const userStore = useUserStore()
const userR = userStore.userS

const fileInputR = ref<HTMLInputElement>()
const visableSubmitR = ref(false)
const fileR = ref<File>()

//
const activeF = (sp: StudentAttach) => {
  selectAttachR.value = sp
  // 同步更新元素属性值
  nextTick(() => {
    fileInputR.value?.click()
  })
}

//
const changeF = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files
  if (!fileList) return
  visableSubmitR.value = true
  fileR.value = fileList[0]
}

const uploadF = async () => {
  if (!fileR.value || !selectAttachR.value?.name) {
    createMessageDialog(`请选择上传文件`)
    return
  }
  const fName = fileR.value.name
  const ext = fName.substring(fName.lastIndexOf('.'))
  if (!selectAttachR.value?.ext?.includes(ext)) {
    createMessageDialog(`请转为${selectAttachR.value?.ext}版上传`)
    return
  }

  const fileName = `${userR.student?.queueNumber}-${userR.name}-${userR.number}-${selectAttachR.value?.name}${ext}`
  if (fileName.includes('/') || fileName.includes('\\')) {
    createMessageDialog(`文件错误`)
    return
  }
  const fdata = new FormData()
  fdata.append('pname', selectAttachR.value?.name ?? '')
  fdata.append('file', fileR.value, fileName)
  const sign = await uploadFileSignatureService(
    `${props.pid}${selectAttachR.value?.name}${fileName}${selectAttachR.value?.number!}`
  )

  processFilesR.value = await uploadFileService(
    props.pid,
    selectAttachR.value?.number!,
    sign,
    fdata
  )
  createElNotificationSuccess('上传成功')
  visableSubmitR.value = false
  // 再次选择时，需清空值
  ;(fileInputR.value as HTMLInputElement).value = ''
}
</script>
<template>
  <el-row class="my-row">
    <el-col style="margin-bottom: 10px">
      <div style="margin-bottom: 10px">
        <el-text type="danger">上传自动覆盖前版</el-text>
      </div>
      <table>
        <tr
          v-for="(attach, index) of studentPR?.studentAttach"
          :key="index"
          style="margin-bottom: 10px">
          <td>
            <el-icon :size="32" color="#67C23A" v-if="showCheckedC(attach)">
              <GoldMedal />
            </el-icon>
            <el-icon :size="28" color="red" v-if="!showCheckedC(attach)">
              <WarningFilled />
            </el-icon>
          </td>
          <td>
            <el-button @click="activeF(attach)" type="primary">{{ attach.name }}</el-button>
          </td>
          <td>
            {{ attach.description }}
          </td>
        </tr>
      </table>

      <input type="file" ref="fileInputR" hidden :accept="selectAttachR?.ext" @change="changeF" />
      <div v-if="visableSubmitR">
        <el-button type="success" @click="uploadF" :icon="Check" style="margin-right: 10px" />
        <span>{{ fileR?.name }}</span>
      </div>
    </el-col>
  </el-row>
</template>
