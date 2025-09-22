<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import RecipeCard from './RecipeCard.vue'
import router from '@/router'

import { useUserStore } from '@/stores/user'
import { UtensilsCrossed, Plus } from 'lucide-vue-next'
// @ts-ignore
import LoaderSpinner from './LoaderSpinner.vue'
import EmptyState from './EmptyState.vue'

import { useHeader } from '@/composables/useHeader'
const { setHeader, clearHeader } = useHeader()

const userStore = useUserStore()

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
</script>

<template>
  <LoaderSpinner v-if="userStore.isLoading" />
  <div class="grids" v-else-if="userStore.savedRecipes.length || userStore.myRecipes.length">
    <section v-if="userStore.myRecipes.length" class="mb-4">
      <p class="medium text2">My Recipes</p>
      <div class="recipes-grid">
        <RecipeCard
          class="recipe"
          v-for="recipe in userStore.myRecipes"
          @select="(recipe: Recipe) => router.push(`/recipe/${recipe.id}`)"
          :key="recipe.id"
          :recipe="recipe"
          :has-recipe-info="false"
          :has-user-info="false"
        />
      </div>
    </section>

    <section v-if="userStore.savedRecipes.length" class="mb-4">
      <p class="medium text2">Saved Recipes</p>
      <div class="recipes-grid">
        <RecipeCard
          class="recipe"
          v-for="recipe in userStore.savedRecipes"
          @select="(recipe: Recipe) => router.push(`/recipe/${recipe.id}`)"
          :key="recipe.id"
          :recipe="recipe"
          :has-recipe-info="false"
          :has-user-info="false"
        />
      </div>
    </section>
  </div>

  <EmptyState
    v-else
    class="justify-center h-full"
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
