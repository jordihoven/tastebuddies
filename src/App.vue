<script setup lang="ts">
// @ts-ignore
import TabBar from './components/TabBar.vue'
// @ts-ignore
import AppHeader from './components/AppHeader.vue'

import { useThemeColor } from './composables/useThemeColor'
import { onMounted } from 'vue'

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
onMounted(() => {
  userStore.fetchUser()
})

useThemeColor()
</script>

<template>
  <AppHeader />
  <main class="page-content">
    <router-view></router-view>
  </main>
  <TabBar />
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
