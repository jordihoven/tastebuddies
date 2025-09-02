<script setup lang="ts">
import TabBar from './components/TabBar.vue'
import AppHeader from './components/AppHeader.vue'
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
