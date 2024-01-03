<script setup lang="ts">
import { render } from 'vue'

const dialogVisible = ref(true)

const props = defineProps<{ message: string; close: Function }>()
const close = () => {
  props.close()
  render(null, document.body)
}
</script>
<template>
  <el-dialog v-model="dialogVisible" title="消息" width="30%" @close="close">
    <span>{{ props.message }}</span>
  </el-dialog>
</template>
