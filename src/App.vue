<script setup lang="ts">
import LoadingVue from '@/components/LoadingVue.vue'
</script>
<template>
  <suspense>
    <template #default>
      <RouterView />
    </template>
    <template #fallback>
      <LoadingVue />
    </template>
  </suspense>
</template>
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
  width: 100vw;
}
/* el-dialog默认计算了滚动条 */
.el-popup-parent--hidden {
  width: 100% !important;
}

#app {
  max-width: 960px;
  background: indigo;
  min-height: 100vh;
  border-radius: 4px;
  margin: 0 auto;
  padding: 15px;
  overflow: overlay;
}

.my-row {
  margin: 5px 5px 10px 5px;
  background-color: white;
  border-radius: 5px;
  padding: 25px 10px 10px 10px;
}
.my-col {
  margin-bottom: 10px;
}
</style>
