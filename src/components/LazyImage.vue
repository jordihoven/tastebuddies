<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
}>()

const loaded = ref(false)
</script>

<template>
  <div class="lazy-image relative overflow-hidden">
    <!-- Placeholder -->
    <div v-if="!loaded" class="absolute inset-0 bg-gray-200 animate-pulse"></div>
    <!-- Real image -->
    <img
      :src="src"
      :alt="alt"
      loading="lazy"
      @load="loaded = true"
      :class="[
        'block w-full h-full object-cover transition-opacity duration-[1.5s] ease-in-out',
        loaded ? 'opacity-100' : 'opacity-0',
      ]"
    />
  </div>
</template>

<style scoped>
.lazy-image img {
  border-radius: calc(var(--radius) - var(--xxs-spacing));
  max-height: 45vh;
  width: 100%;
  aspect-ratio: 1/1.5;
  object-fit: cover;
}
</style>
