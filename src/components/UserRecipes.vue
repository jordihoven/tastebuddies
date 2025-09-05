<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import RecipeCard from './RecipeCard.vue'

import { useUserStore } from '@/stores/user'
import router from '@/router'
const userStore = useUserStore()

const SAVED_KEY = 'likedRecipes'
const savedRecipes = ref<Recipe[]>([])

async function fetchSavedRecipes() {
  if (userStore.user) {
    // Logged in → fetch from saved_recipes
    const { data, error } = await supabase
      .from('saved_recipes')
      .select('recipe_id')
      .eq('user_id', userStore.user.id)

    if (error) {
      console.error('Error: ', error)
      return
    }

    const recipeIds = data.map((d) => d.recipe_id)
    if (!recipeIds.length) return

    const { data: recipesData, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .in('id', recipeIds)

    if (!recipesError) savedRecipes.value = recipesData ?? []
  } else {
    // Guest → localStorage
    const recipeIds = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
    if (!recipeIds.length) return

    const { data, error } = await supabase.from('recipes').select('*').in('id', recipeIds)
    if (!error) savedRecipes.value = data ?? []
  }
}

onMounted(fetchSavedRecipes)

// watcher needed to re-trigger fetching recipes since the userStore.user object isn't loaded fast enough... #TODO: move logic to store
watch(
  () => userStore.user,
  () => {
    fetchSavedRecipes()
  },
)
</script>

<template>
  <div class="recipes-grid" v-if="savedRecipes.length">
    <RecipeCard
      class="recipe"
      v-for="recipe in savedRecipes"
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
