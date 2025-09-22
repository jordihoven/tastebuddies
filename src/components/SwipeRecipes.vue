<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import router from '@/router'
// icons
import { HeartOff, Heart, GalleryHorizontal, Plus } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase.ts'
// components
import RecipeCard from './RecipeCard.vue'
// @ts-ignore
import SwipeCard from './SwipeCard.vue'
import EmptyState from './EmptyState.vue'
// @ts-ignore
import LoaderSpinner from './LoaderSpinner.vue'

import { useHeader } from '@/composables/useHeader'
const { setHeader, clearHeader } = useHeader()

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const loadingRecipes = ref(false)

const recipes = ref<Recipe[]>([]) // storing all recipes, fetched from supabase...
// storing likes / disliked by user...
const likedRecipes = ref<Recipe[]>([])
const dislikedRecipes = ref<Recipe[]>([])

const currentRecipe = computed(() => recipes.value[0] ?? null) // the current recipe to be swiped...

// get recipes from supabase...
async function loadRecipes() {
  loadingRecipes.value = true // loading...

  const { data, error } = await supabase.from('recipes').select('*')

  if (error) {
    console.error(error)
    return
  }

  recipes.value = shuffle(data ?? []) // store the fetched recipes (or clear recipes if nothing is fetched?)

  loadingRecipes.value = false // done loading..
}

// Fisher-Yates shuffle...
function shuffle(array: any) {
  // any because supabase does not return Recipe type...
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const setHeaderActions = () => {
  setHeader({
    rightActions: [
      {
        icon: Plus,
        onClick() {
          router.push('/addrecipe')
        },
      },
    ],
  })
}

onMounted(async () => {
  loadRecipes() // to populate deck...
  if (userStore.user) {
    setHeaderActions()
  }
})

watch(
  () => userStore.user,
  (newUser) => {
    if (newUser) {
      setHeaderActions()
    }
  },
  { immediate: true },
)

onUnmounted(clearHeader)

const likeRecipe = async () => {
  // remove the liked recipe from the recipes deck...
  const recipe = recipes.value.shift()
  if (!recipe) return
  likedRecipes.value.push(recipe) // add recipe to likedRecipe array...
  router.push({ path: `/recipe/${recipe.id}` }) // navigate to the recipe details page...
}
const dislikeRecipe = () => {
  const recipe = recipes.value.shift() // remove the recipe from the array...
  if (!recipe) return
  dislikedRecipes.value.push(recipe)
}
</script>

<template>
  <div class="flex flex-col flex-1 justify-center overflow-x-hidden">
    <LoaderSpinner v-if="loadingRecipes && userStore.isLoading" />
    <div v-else-if="currentRecipe">
      <section class="flex flex-col gap-2">
        <SwipeCard @like="likeRecipe" @dislike="dislikeRecipe">
          <RecipeCard :recipe="currentRecipe" :hasRecipeInfo="true" />
        </SwipeCard>
      </section>
      <section class="recipe-actions flex gap-2 justify-center mt-4">
        <button @click="dislikeRecipe" class="dislike"><HeartOff color="var(--danger)" /></button>
        <button @click="likeRecipe" class="like"><Heart color="var(--primary)" /></button>
      </section>
    </div>
    <EmptyState
      v-else
      :icon="GalleryHorizontal"
      title="No more recipes to show"
      description="You liked/disliked the entire deck! Resfresh to get a clean deck."
    />
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
