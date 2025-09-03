<script setup lang="ts">
import { HeartOff, Heart } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.ts'
// @ts-ignore
import RecipeCard from './RecipeCard.vue'

// Recipe type (should be stored elsewhere, since this interface will be used in multiple places)
interface Recipe {
  id: string
  name: string
  duration: number
  difficulty: string
  calories: number
  image_url: string
}
const recipes = ref<Recipe[]>([]) // storing all recipes, fetched from supabase...
const currentRecipe = computed(() => recipes.value[0] ?? null) // the current recipe to be swiped...

// get recipes from supabase...
async function loadRecipes() {
  console.log('loading recipes...')

  const { data, error } = await supabase.from('recipes').select('*').limit(10)

  if (error) {
    console.error(error)
    return
  }

  recipes.value = data ?? [] // store the fetched recipes (or clear recipes of nothing is fetched?)
}

onMounted(loadRecipes)

const SAVED_KEY = 'likedRecipes'

// load saved recipe ids from localstorage
const savedRecipes = ref<string[]>(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'))

const likeRecipe = () => {
  const recipe = recipes.value.shift()
  if (recipe) {
    savedRecipes.value.push(recipe.id)
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedRecipes.value))
  }
}
const dislikeRecipe = () => {
  recipes.value.shift() // remove the recipe from the array...
}
</script>

<template>
  <div class="flex flex-col flex-1 justify-center">
    <section class="flex flex-col gap-2">
      <RecipeCard v-if="currentRecipe" :recipe="currentRecipe" :hasRecipeInfo="true" />
      <div v-else><p class="medium text-2 text-center">No more recipes to show...</p></div>
    </section>

    <section class="recipe-actions flex gap-2 justify-center mt-4">
      <button @click="dislikeRecipe" class="dislike"><HeartOff color="var(--danger)" /></button>
      <button @click="likeRecipe" class="like"><Heart color="var(--primary)" /></button>
    </section>
  </div>
</template>

<style scoped>
.recipe-card {
  background-color: var(--background2);
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--stroke);
  box-shadow: var(--box-shadow-card);
}
.recipe-card img {
  border-radius: calc(var(--radius) - var(--xxs-spacing));
  max-height: 60vh;
}

button.dislike,
button.like {
  border-radius: 100%;
  padding: 12px;
}
</style>
