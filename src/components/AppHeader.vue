<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import router from '@/router'
import { ArrowLeft } from 'lucide-vue-next'

import { useHeader } from '@/composables/useHeader'
const { leftAction, rightAction } = useHeader()

const route = useRoute()

const title = computed(() => route.meta.title ?? 'Tastebuddies') // use metadata from router to get the Title

const goBack = () => {
  if (router.options.history.state.back) {
    router.back()
  } else {
    router.push('/swipe')
  }
}

// Trigger left click
const onLeftClick = () => {
  if (leftAction.value === 'back') goBack()
  else if (leftAction.value && typeof leftAction.value !== 'string') leftAction.value.onClick()
}

// Trigger right click
const onRightClick = () => {
  if (rightAction.value && typeof rightAction.value !== 'string') rightAction.value.onClick()
}
</script>

<template>
  <header id="app-header" class="flex justify-between p-2 items-center">
    <div class="header-content flex items-center justify-between gap-2">
      <div class="left-button w-12 flex justify-start">
        <button v-if="leftAction" @click="onLeftClick" class="header-button text2">
          <component v-if="leftAction !== 'back'" :is="leftAction.icon" :size="20" />
          <ArrowLeft v-else :size="20" class="text2" />
        </button>
      </div>

      <div class="flex-1">
        <p class="medium text2 large-body text-center">{{ title }}</p>
      </div>

      <div class="right-button w-12 flex justify-end">
        <button v-if="rightAction" @click="onRightClick" class="header-button text2">
          <component v-if="rightAction !== 'back'" :is="rightAction.icon" :size="20" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
header#app-header {
  border-bottom: 1px solid var(--stroke);
  min-height: 52px;
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
