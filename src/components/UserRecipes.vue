<template>
  <div class="recipes-grid" v-if="savedRecipes.length">
    <RecipeCard
      v-for="recipe in savedRecipes"
      :key="recipe.id"
      :recipe="recipe"
      :has-recipe-info="false"
    />
  </div>
  <div v-else>
    <p class="text2">Liked recipes will be shown here.</p>
  </div>
  <button v-if="savedRecipes.length" @click="ClearLocalRecipes" class="w-fit mt-4">
    Clear recipes
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import RecipeCard from './RecipeCard.vue'

interface Recipe {
  id: string
  name: string
  duration: number
  difficulty: string
  calories: number
  image_url: string
}

const SAVED_KEY = 'likedRecipes'
const savedRecipeIds = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
const savedRecipes = ref<Recipe[]>([])

async function fetchSavedRecipes() {
  if (!savedRecipeIds.length) return // if there's no recipes saved, don't fetch...

  const { data, error } = await supabase.from('recipes').select('*').in('id', savedRecipeIds)

  if (error) {
    console.error('Error fetching: ', error)
  } else {
    savedRecipes.value = data ?? []
  }
}

// temp method to clear recipes from local storage...
function ClearLocalRecipes() {
  localStorage.removeItem(SAVED_KEY)
  window.location.reload()
}

onMounted(fetchSavedRecipes)
</script>

<style scoped>
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--xs-spacing);
}

.recipe {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  padding: var(--xs-spacing);
  background-color: var(--background2);
  border-radius: var(--radius);
  border: 1px solid var(--stroke);
  transition: var(--transition);
}

.recipe:hover {
  cursor: pointer;
}

@media only screen and (max-width: 660px) {
  .recipes-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
