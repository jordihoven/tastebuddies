<script setup lang="ts">
import { LoaderPinwheel } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col gap-2 justify-center items-center h-full">
    <LoaderPinwheel :size="20" class="spin primary" />
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}
</style>
