<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import router from '@/router'
import { ArrowLeft, Plus } from 'lucide-vue-next'

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

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

const isSwipePage = computed(() => route.meta.title === 'Swipe')
const goToAddRecipe = () => router.push('/addRecipe') // #TODO: same, also route meta...
</script>

<template>
  <header id="app-header" class="flex justify-between p-2 items-center">
    <div class="header-content flex items-center justify-between">
      <p v-if="!props.showBackButton" class="medium text2">{{ title }}</p>
      <button class="header-button" v-if="props.showBackButton" @click="goBack">
        <ArrowLeft :size="16" color="var(--text2)" />
      </button>
      <button class="header-button" v-if="isSwipePage && userStore.user" @click="goToAddRecipe">
        <Plus :size="16" class="text2" />
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

.header-button {
  width: fit-content;
  border: none;
  background-color: transparent;
  padding: 4px; /* so the header remains the same height, whether there's text or an icon */
}

.header-button:hover {
  background-color: var(--background2);
}
</style>
