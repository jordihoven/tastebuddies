<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { HeartOff, Heart, GalleryHorizontal, Plus } from 'lucide-vue-next'
import { useRecipeStore } from '@/stores/recipe'
import { useUserStore } from '@/stores/user'
import RecipeCard from './RecipeCard.vue'
import SwipeCard from './SwipeCard.vue'
import EmptyState from './EmptyState.vue'
import LoaderSpinner from './LoaderSpinner.vue'
import { useHeader } from '@/composables/useHeader'

const recipeStore = useRecipeStore()
const userStore = useUserStore()
const { setHeader, clearHeader } = useHeader()
const { currentRecipe, isLoading } = storeToRefs(recipeStore) // grab reactive properties from store

function setHeaderActions() {
  setHeader({
    rightActions: [{ icon: Plus, onClick: () => router.push('/addrecipe') }],
  })
}

// fetch recipes on mount
onMounted(async () => {
  if (!recipeStore.recipes.length) await recipeStore.getRecipesForDeck() // fetch a fresh deck if the recipes store is empty...
  if (userStore.user) setHeaderActions()
})

// watch user to set header if they log in later
watch(
  () => userStore.user,
  (newUser) => newUser && setHeaderActions(),
  { immediate: true },
)

onUnmounted(clearHeader)
</script>

<template>
  <div class="flex flex-col flex-1 justify-center overflow-x-hidden">
    <LoaderSpinner v-if="isLoading" />
    <div v-else-if="currentRecipe">
      <section class="flex flex-col gap-2">
        <SwipeCard
          @like="router.push(`/recipe/${currentRecipe.id}`)"
          @dislike="recipeStore.dislikeRecipe()"
        >
          <RecipeCard :recipe="currentRecipe" :hasRecipeInfo="true" />
        </SwipeCard>
      </section>

      <section class="recipe-actions flex gap-2 justify-center mt-4">
        <button @click="recipeStore.dislikeRecipe()" class="dislike">
          <HeartOff color="var(--danger)" />
        </button>
        <button @click="router.push(`/recipe/${currentRecipe.id}`)" class="like">
          <Heart color="var(--primary)" />
        </button>
      </section>
    </div>

    <EmptyState
      v-else
      :icon="GalleryHorizontal"
      title="No more recipes to show"
      description="You liked/disliked the entire deck! Refresh to get a clean deck."
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
