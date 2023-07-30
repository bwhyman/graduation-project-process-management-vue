<script setup lang="ts">
import HeaderView from './header/IndexView.vue'
import { useSettingStore } from '@/stores/SettingStore'
const UpdatePassword = defineAsyncComponent(() => import('./UpdatePasswordView.vue'))

const settingStore = useSettingStore()
</script>
<template>
  <HeaderView />
  <RouterView />
  <!--  -->
  <UpdatePassword v-if="settingStore.showResetPasswordS" />
</template>
