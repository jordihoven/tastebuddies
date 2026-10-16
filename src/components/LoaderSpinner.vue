<script setup lang="ts">
import { LoaderPinwheel } from 'lucide-vue-next'
withDefaults(
  defineProps<{
    fullHeight?: boolean
  }>(),
  { fullHeight: true },
)
</script>

<template>
  <div
    class="loader-wrapper flex flex-col gap-2 justify-center items-center"
    :class="{ 'h-full': fullHeight }"
  >
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

.loader-wrapper.h-full {
  height: 100%;
}
</style>
