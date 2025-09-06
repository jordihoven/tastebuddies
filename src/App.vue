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
  showBackButton: route.meta.showBackButton === true,
  hideTabBar: route.meta.hideTabBar === true,
}))

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUser()
})

useThemeColor()
</script>

<template>
  <AppHeader :show-back-button="layout.showBackButton" />
  <main class="page-content">
    <router-view></router-view>
  </main>
  <TabBar v-if="!layout.hideTabBar" />
</template>

<style>
.page-content {
  max-width: 60em;
  margin: 0 auto;
  padding: var(--xs-spacing);
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
