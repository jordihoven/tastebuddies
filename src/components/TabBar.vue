<script setup>
import { User, GalleryHorizontal, UtensilsCrossed } from 'lucide-vue-next'
</script>

<template>
  <nav class="flex justify-center gap-8">
    <router-link to="/profile" active-class="active"><User size="24" /></router-link>
    <router-link to="/swipe" active-class="active"><GalleryHorizontal size="24" /></router-link>
    <router-link to="/recipes" active-class="active"><utensils-crossed size="24" /></router-link>
  </nav>
</template>

<style scoped>
nav {
  border-top: 1px solid var(--stroke);
  padding: 1rem;
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  background-color: var(--background1);
}

nav a {
  color: var(--text2);
}

.active {
  color: var(--primary);
}
</style>
