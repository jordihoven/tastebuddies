<script setup lang="ts">
const props = defineProps({
  duration: Number,
  calories: Number,
  difficulty: String,
})

import { Clock, Apple, Star } from 'lucide-vue-next'
</script>

<template>
  <div class="flex gap-2">
    <div class="duration flex gap-1 items-center">
      <Clock :size="16" color="var(--text2)" />
      <span class="medium">{{ props.duration }}min</span>
    </div>
    <div class="carlories flex gap-1 items-center">
      <Apple :size="16" color="var(--text2)" />
      <span class="medium">{{ props.calories }}kcal</span>
    </div>
    <div class="difficulty flex gap-1 items-center">
      <Star :size="16" color="var(--text2)" />
      <span class="medium">{{ props.difficulty }}</span>
    </div>
  </div>
</template>
