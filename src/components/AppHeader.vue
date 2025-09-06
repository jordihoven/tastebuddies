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

const goBack = () => {
  if (router.options.history.state.back) {
    router.back()
  } else {
    router.push('/swipe')
  }
}
</script>

<template>
  <header id="app-header" class="flex justify-between p-2 items-center">
    <div class="header-content">
      <p v-if="!props.showBackButton" class="medium text2">{{ title }}</p>
      <button class="back-button" v-if="props.showBackButton" @click="goBack">
        <ArrowLeft :size="16" color="var(--text2)" />
      </button>
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
  width: fit-content;
  border: none;
  background-color: transparent;
  padding: 4px; /* so the header remains the same height, whether there's text or an icon */
}

.back-button:hover {
  background-color: var(--background2);
}
</style>
