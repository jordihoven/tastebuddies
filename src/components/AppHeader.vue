<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import router from '@/router'
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps({
  showBackButton: Boolean,
})

const route = useRoute()

const title = computed(() => route.meta.title ?? 'Tastebuddies') // use metadata from router to get the Title
</script>

<template>
  <header id="app-header" class="flex justify-between p-2 items-center">
    <div class="header-content">
      <p v-if="!props.showBackButton" class="medium text2">{{ title }}</p>
      <div class="back-button" v-if="props.showBackButton" @click="router.back()">
        <ArrowLeft :size="16" color="var(--text2)" />
      </div>
    </div>
  </header>
</template>

<style scoped>
header#app-header {
  border-bottom: 1px solid var(--stroke);
}

.header-content {
  margin: 0 auto;
  max-width: 60em;
  width: 100%;
}

.back-button {
  padding: 4px; /* so the header remains the same height, whether there's text or an icon */
}
</style>
