<script setup lang="ts"></script>
<template>
  <RouterView v-slot="{ Component }" :key="$route.fullPath">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
