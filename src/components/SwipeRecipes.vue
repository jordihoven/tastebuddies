<script setup lang="ts">
import { HeartOff, Heart } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import RecipeCard from './RecipeCard.vue'

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const recipes = ref<Recipe[]>([]) // storing all recipes, fetched from supabase...
const currentRecipe = computed(() => recipes.value[0] ?? null) // the current recipe to be swiped...

// get recipes from supabase...
async function loadRecipes() {
  const { data, error } = await supabase.from('recipes').select('*').limit(10)

  if (error) {
    console.error(error)
    return
  }

  recipes.value = shuffle(data ?? []) // store the fetched recipes (or clear recipes of nothing is fetched?)
}

// Fisher-Yates shuffle...
function shuffle(array: any) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

onMounted(loadRecipes)

const SAVED_KEY = 'likedRecipes'

// load saved recipe ids from localstorage
const savedRecipes = ref<string[]>(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'))

const likeRecipe = async () => {
  const recipe = recipes.value.shift()
  if (!recipe) return

  if (userStore.user) {
    // logged in -> supabase storage...
    await saveRecipeForUser(recipe.id)
  } else {
    // anon user -> localStorage...
    savedRecipes.value.push(recipe.id)
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedRecipes.value))
  }
}
const dislikeRecipe = () => {
  recipes.value.shift() // remove the recipe from the array...
}

async function saveRecipeForUser(recipeId: string) {
  if (!userStore.user) return // skip if there's no user logged in...

  const { error } = await supabase
    .from('saved_recipes')
    .insert({ user_id: userStore.user.id, recipe_id: recipeId })

  if (error) {
    console.error('Error saving: ', error)
  }
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
  box-shadow: var(--box-shadow-card);
}
</style>
