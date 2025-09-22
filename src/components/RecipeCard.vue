<script setup lang="ts">
// @ts-ignore
import RecipeInfo from './RecipeInfo.vue'
import LazyImage from './LazyImage.vue'

// #TODO: feel like this can be done cleaner...
const props = withDefaults(
  defineProps<{
    recipe: Recipe
    hasRecipeInfo?: boolean
    hasUserInfo?: boolean
  }>(),
  {
    hasRecipeInfo: true,
    hasUserInfo: true,
  },
)
</script>

<template>
  <div @click="$emit('select', recipe)" class="recipe-card flex flex-col gap-2">
    <LazyImage
      v-if="props.recipe.image_url"
      :src="props.recipe.image_url"
      :alt="props.recipe.name"
    />
    <div class="recipe-info flex flex-col gap-[4px]">
      <p v-if="props.recipe.created_by_name && props.hasUserInfo" class="text2">
        {{ props.recipe.created_by_name }}
      </p>
      <p class="medium clip-text">{{ props.recipe.name }}</p>
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
</style>
