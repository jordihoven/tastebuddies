<script setup lang="ts">
// @ts-ignore
import RecipeInfo from './RecipeInfo.vue'
// #TODO: feel like this can be done cleaner...
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
</script>

<template>
  <div class="recipe-card flex flex-col gap-2">
    <img v-if="props.recipe.image_url" :src="props.recipe.image_url" alt="recipe image" />
    <div class="recipe-info flex flex-col gap-[4px]">
      <p class="medium">{{ props.recipe.name }}</p>
      <RecipeInfo
        v-if="
          props.hasRecipeInfo &&
          props.recipe.duration &&
          props.recipe.calories &&
          props.recipe.difficulty
        "
        :duration="props.recipe.duration"
        :calories="props.recipe.calories"
        :difficulty="props.recipe.difficulty"
      />
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
  aspect-ratio: 1/1.5;
  object-fit: cover;
}
</style>
