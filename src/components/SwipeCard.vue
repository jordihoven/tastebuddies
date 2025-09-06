<script setup lang="ts">
import { shallowRef, ref, watch, computed } from 'vue'
import { usePointerSwipe } from '@vueuse/core'

const target = shallowRef<HTMLElement | null>(null)
const swipeThreshold = 100

// Emit events to parent
const emit = defineEmits(['like', 'dislike'])

const isSwiping = ref(false)

// Local writable distance (so we can reset)
const distanceXLocal = ref(0)

// Read-only reactive distance from VueUse
const { distanceX } = usePointerSwipe(target, {
  disableTextSelect: true,
  threshold: 0,
  onSwipeEnd() {
    if (-distanceX.value > swipeThreshold)
      emit('like') // right swipe
    else if (-distanceX.value < -swipeThreshold) emit('dislike') // left swipe
    distanceXLocal.value = 0 // reset mirrored distance
  },
})

const rotate = computed(() => {
  const maxRotate = 15 // degrees
  const width = target.value?.offsetWidth || 300
  return (distanceXLocal.value / width) * maxRotate
})

// Mirror the read-only distance to local writable distance
watch(distanceX, (v) => {
  distanceXLocal.value = -v
})

watch(distanceXLocal, (v) => {
  isSwiping.value = Math.abs(v) > 0
})
</script>

<template>
  <div
    ref="target"
    :class="{ 'transition-none': isSwiping }"
    class="swipe-card"
    :style="{ transform: `translateX(${distanceXLocal}px) rotate(${rotate}deg)` }"
  >
    <slot />
  </div>
</template>

<style scoped>
.swipe-card {
  touch-action: none;
  will-change: transform;
  cursor: grab;
  transition: transform 0.3s ease-out;
}

.transition-none {
  transition: none;
}
</style>
