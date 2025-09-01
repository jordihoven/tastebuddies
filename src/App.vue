<script setup lang="ts">
import TabBar from './components/TabBar.vue'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <router-view class="container"></router-view>
  <TabBar />
</template>

<style scoped>
.container {
  padding: var(--xs-spacing);
}
</style>
