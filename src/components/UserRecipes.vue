<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import RecipeCard from './RecipeCard.vue'
import router from '@/router'

import { useUserStore } from '@/stores/user'
import { UtensilsCrossed } from 'lucide-vue-next'
// @ts-ignore
import LoaderSpinner from './LoaderSpinner.vue'
import EmptyState from './EmptyState.vue'

const userStore = useUserStore()

const loadingRecipes = ref(true)

onMounted(async () => {
  loadingRecipes.value = true
  await userStore.fetchSavedRecipes()
  loadingRecipes.value = false
})
</script>

<template>
  <LoaderSpinner v-if="loadingRecipes" />
  <div class="recipes-grid" v-else-if="userStore.savedRecipes.length">
    <RecipeCard
      class="recipe"
      v-for="recipe in userStore.savedRecipes"
      @select="(recipe: Recipe) => router.push(`/recipe/${recipe.id}`)"
      :key="recipe.id"
      :recipe="recipe"
      :has-recipe-info="false"
    />
  </div>
  <EmptyState
    v-else
    :icon="UtensilsCrossed"
    title="Saved recipes will show here"
    description="Once you save your first recipe, it will show here. Get swiping!"
  />
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
