<script setup>
import { User, GalleryHorizontal, UtensilsCrossed } from 'lucide-vue-next'
</script>

<template>
  <nav class="flex justify-center gap-8">
    <router-link to="/profile" active-class="active"><User size="20" /></router-link>
    <router-link to="/swipe" active-class="active"><GalleryHorizontal size="20" /></router-link>
    <router-link to="/recipes" active-class="active"><utensils-crossed size="20" /></router-link>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid var(--stroke);
  padding: 1rem;
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

nav a {
  color: var(--text2);
}

.active {
  color: var(--primary);
}
</style>
