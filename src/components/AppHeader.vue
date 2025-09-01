<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const title = computed(() => route.meta.title ?? 'Tastebuddies') // use metadata from router to get the Title
</script>

<template>
  <header id="app-header" class="flex justify-between p-2">
    <p class="medium text2">{{ title }}</p>
  </header>
</template>

<style scoped>
header#app-header {
  border-bottom: 1px solid var(--stroke);
}
</style>
