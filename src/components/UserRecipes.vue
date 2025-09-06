<script setup lang="ts">
import { onMounted, watch } from 'vue'
import RecipeCard from './RecipeCard.vue'
import router from '@/router'

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

onMounted(async () => {
  userStore.fetchSavedRecipes()
})
</script>

<template>
  <div class="recipes-grid" v-if="userStore.savedRecipes.length">
    <RecipeCard
      class="recipe"
      v-for="recipe in userStore.savedRecipes"
      @select="(recipe: Recipe) => router.push(`/recipe/${recipe.id}`)"
      :key="recipe.id"
      :recipe="recipe"
      :has-recipe-info="false"
    />
  </div>
  <div v-else>
    <p class="text2">Liked recipes will be shown here.</p>
  </div>
</template>

<style scoped>
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--xs-spacing);
}

/* #TODO not sure this should live here, or in the recipeCard */
.recipe {
  transition: var(--transition);
}
.recipe:hover {
  cursor: pointer;
  filter: brightness(95%);
}

@media only screen and (max-width: 660px) {
  .recipes-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
