<script setup lang="ts">
// todo: feel like this can be done cleaner...
const props = withDefaults(
  defineProps<{
    recipe: Recipe
    hasRecipeInfo: boolean
  }>(),
  {
    hasRecipeInfo: true,
    // make this not required, so that not giving it means it's shown...
  },
)

interface Recipe {
  id: string
  name: string
  duration: number
  difficulty: string
  calories: number
  image_url: string
}

import { Clock, Apple, Star } from 'lucide-vue-next'
</script>

<template>
  <div class="recipe-card flex flex-col gap-2">
    <img v-if="props.recipe.image_url" :src="props.recipe.image_url" alt="recipe image" />
    <div class="recipe-info flex flex-col gap-[4px]">
      <p class="medium">{{ props.recipe.name }}</p>
      <div class="flex gap-2" v-if="props.hasRecipeInfo">
        <!-- make duration, calories & difficulty into a RecipeInfo component taking a type of duration, calories or difficulty? -->
        <div class="duration flex gap-1 items-center">
          <Clock :size="16" color="var(--text2)" />
          <span class="medium">{{ props.recipe.duration }}min</span>
        </div>
        <div class="carlories flex gap-1 items-center">
          <Apple :size="16" color="var(--text2)" />
          <span class="medium">{{ props.recipe.calories }}kcal</span>
        </div>
        <div class="difficulty flex gap-1 items-center">
          <Star :size="16" color="var(--text2)" />
          <span class="medium">{{ props.recipe.difficulty }}</span>
        </div>
      </div>
    </div>
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
  max-height: 40vh;
  width: 100%;
}
</style>
