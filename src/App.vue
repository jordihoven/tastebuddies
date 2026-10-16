<script setup lang="ts">
// @ts-ignore
import TabBar from './components/TabBar.vue'
// @ts-ignore
import AppHeader from './components/AppHeader.vue'

import { useThemeColor } from './composables/useThemeColor'
import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'
const route = useRoute()

// layout related info, based on route...
const layout = computed(() => ({
  hideTabBar: route.meta.hideTabBar === true,
}))

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

onMounted(async () => {
  await userStore.initialize()
})

useThemeColor()
</script>

<template>
  <AppHeader />
  <main class="page-content">
    <div class="page-inner">
      <router-view></router-view>
    </div>
  </main>
  <TabBar v-if="!layout.hideTabBar" />
</template>

<style>
/* scroll container: full width so its scrollbar sits on the screen edge */
.page-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
}

/* readable content width, centered; overflow stays visible so the swipe deck can
   travel past this box and only clip at the screen edge (page-content) */
.page-inner {
  flex: 1;
  width: 100%;
  max-width: 60em;
  margin: 0 auto;
  padding: var(--s-spacing) var(--xs-spacing);
  display: flex;
  flex-direction: column;
}
</style>
