<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase.ts'

// @ts-ignore
import RecipeInfo from './RecipeInfo.vue'

import { Plus } from 'lucide-vue-next'

const route = useRoute() // current route object, with path, params, query, name...
const recipe = ref<RecipeDetails | null>(null)

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

interface Ingredient {
  name: string
  amount: string
}

interface RecipeDetails extends Recipe {
  ingredients: Ingredient[]
  instructions: string
}

async function loadRecipe() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error) {
    console.error(error)
    return
  }

  recipe.value = data
}

// load saved recipe ids from localstorage
const SAVED_KEY = 'likedRecipes'
const savedRecipes = ref<string[]>(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'))

async function saveRecipe(recipeId: string) {
  if (userStore.user) {
    // logged in user ->
    const { error } = await supabase
      .from('saved_recipes')
      .insert({ user_id: userStore.user.id, recipe_id: recipeId })

    if (error) {
      console.error('Error saving: ', error)
    }
  } else {
    // guest users ->
    savedRecipes.value.push(recipeId)
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedRecipes.value))
  }
}

onMounted(loadRecipe)
</script>

<template>
  <div v-if="recipe" class="flex flex-col gap-2">
    <img v-if="recipe.image_url" class="recipe-image" :src="recipe.image_url" alt="liked recipe" />
    <section>
      <h3>{{ recipe.name }}</h3>
      <RecipeInfo
        :duration="recipe.duration"
        :calories="recipe.calories"
        :difficulty="recipe.difficulty"
      />
    </section>
    <button @click="saveRecipe(recipe.id)" class="flex justify-center primary">
      <Plus :size="16" />
      Save recipe
    </button>
    <section class="flex flex-col gap-1">
      <span class="medium">Ingredients</span>
      <div class="ingredients">
        <div
          class="ingredient flex justify-between"
          v-if="recipe.ingredients"
          v-for="(ingredient, index) in recipe.ingredients"
          :key="index"
        >
          <span class="medium text1">{{ ingredient.name }}</span>
          <span>{{ ingredient.amount }}</span>
        </div>
      </div>
    </section>
  </div>
  <div v-else>Loading recipe...</div>
</template>

<style scoped>
.recipe-image {
  border-radius: var(--radius);
  width: 100%;
  max-height: 30vh;
  object-fit: cover;
}

.ingredients {
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  padding: var(--xs-spacing);
  background-color: var(--background2);
}
</style>
