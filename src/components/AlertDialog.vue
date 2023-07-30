<script lang="ts" setup>
import { useMessageStore } from '@/stores/MessageStore'

const store = useMessageStore()
const messageR = storeToRefs(store).messageS
const active = ref(true)

const close = () => {
  messageR.value = ''
}
</script>
<template>
  <el-dialog v-model="active" title="Message" width="30%" :before-close="close">
    <span>{{ messageR }}</span>
  </el-dialog>
</template>
