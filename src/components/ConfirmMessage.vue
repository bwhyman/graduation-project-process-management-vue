<script setup lang="ts">
import { useMessageStore } from '@/stores/MessageStore'

const dialogVisible = ref(true)

const messageR = storeToRefs(useMessageStore()).messageS
const closeD = storeToRefs(useMessageStore()).closeF
</script>
<template>
  <el-dialog v-model="dialogVisible" title="消息" width="30%" @close="closeD">
    <span>{{ messageR }}</span>
  </el-dialog>
</template>
