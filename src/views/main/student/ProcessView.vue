<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import { useProcessStore } from '@/stores/ProcessStore'
import type { StudentProcess } from '@/types/type'
import { uploadFileService } from '@/services/StudentService'
import { useUserStore } from '@/stores/UserStore'
import { useMessageStore } from '@/stores/MessageStore'
const props = defineProps<{ pid: string }>()

const processStore = useProcessStore()
const studentProcessR = ref<StudentProcess>()
const studentProcessesR = processStore.studentProcessesS
const userStore = useUserStore()
const messageStore = useMessageStore()
const userR = userStore.userS

studentProcessR.value = studentProcessesR.find((sp) => sp.processId == props.pid)

const fileInputR = ref<HTMLInputElement>()
const visableSubmitR = ref(false)
const fileR = ref<File>()

const activeF = () => {
  fileInputR.value?.click()
}
const changeF = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files
  if (!fileList) return
  visableSubmitR.value = true
  fileR.value = fileList[0]
}

const uploadF = () => {
  const fdata = new FormData()
  if (!fileR.value) return
  const fName = fileR.value.name
  const ext = fName.substring(fName.lastIndexOf('.'))
  if (ext != '.pdf') {
    storeToRefs(messageStore).messageS.value = '请转为PDF版上传'
    return
  }

  const fileName = `${userR.student?.queueNumber}-${userR.name}-${studentProcessR.value?.name}${ext}`

  fdata.append('pname', studentProcessR.value?.name ?? '')
  fdata.append('file', fileR.value, fileName)
  fdata.append('pid', props.pid)
  userR.id && fdata.append('sid', userR.id)
  studentProcessR.value?.name &&
    uploadFileService(fdata).then(() => {
      storeToRefs(messageStore).messageS.value = '上传成功'
      visableSubmitR.value = false
      // 再次选择时，需清空值
      ;(fileInputR.value as HTMLInputElement).value = ''
    })
}
</script>
<template>
  <el-row class="my-row">
    <el-col style="margin-bottom: 10px">
      <div style="margin-bottom: 3px">
        <el-button @click="activeF" type="primary">选择PDF版{{ studentProcessR?.name }}</el-button>
        <el-button type="success" @click="uploadF" :icon="Check" v-if="visableSubmitR" />
        <input type="file" ref="fileInputR" hidden accept=".pdf" @change="changeF" />
      </div>
      <div style="margin-bottom: 10px">
        <el-text type="danger">上传自动覆盖前版</el-text>
      </div>
      <div>
        <span v-if="visableSubmitR">{{ fileR?.name }}</span>
      </div>
    </el-col>
  </el-row>
</template>
