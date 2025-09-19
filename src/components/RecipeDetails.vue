<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase.ts'

// @ts-ignore
import RecipeInfo from './RecipeInfo.vue'
import LazyImage from './LazyImage.vue'
// @ts-ignore
import LoaderSpinner from './LoaderSpinner.vue'

import { Plus, Edit } from 'lucide-vue-next'

import { useHeader } from '@/composables/useHeader'
const { setHeader, clearHeader } = useHeader()

const route = useRoute() // current route object, with path, params, query, name...
const recipe = ref<RecipeDetails | null>(null)

import { useUserStore } from '@/stores/user'
import router from '@/router'
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

const goToEditRecipe = () => {
  // go to edit recipe with the recipeId...
  if (!recipe.value) return
  router.push({
    path: '/addrecipe',
    query: { editId: recipe.value.id }, // send a editIt on router push to the addRecipes page, so it can fetch that recipe and populate the fields...
  })
}

// detecting whether the current user is the owner of the recipe...
const isOwner = computed(() => {
  return recipe.value?.created_by === userStore.user?.id
})

onMounted(async () => {
  await loadRecipe()
  if (isOwner.value) {
    setHeader({
      leftAction: 'back',
      rightAction: {
        icon: Edit,
        onClick: goToEditRecipe,
      },
    })
  } else {
    setHeader({ leftAction: 'back' })
  }
})

onUnmounted(clearHeader)
</script>

<template>
  <div v-if="recipe" class="flex flex-col gap-2">
    <LazyImage v-if="recipe.image_url" :src="recipe.image_url" :alt="recipe.name" />
    <section>
      <h3>{{ recipe.name }}</h3>
      <p class="text2" v-if="recipe?.created_by_name">by {{ recipe.created_by_name }}</p>
      <RecipeInfo
        :duration="recipe.duration"
        :calories="recipe.calories"
        :difficulty="recipe.difficulty"
      />
    </section>
    <button
      v-if="!userStore.hasSavedRecipe(recipe.id)"
      @click="userStore.saveRecipe(recipe.id)"
      class="flex justify-center primary"
    >
      <Plus :size="16" />
      Save recipe
    </button>
    <section class="flex flex-col gap-1" v-if="recipe.ingredients.length > 0">
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
  <LoaderSpinner v-else />
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
