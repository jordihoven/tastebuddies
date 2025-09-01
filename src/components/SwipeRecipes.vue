<script setup>
import { Clock, Apple, Star, HeartOff, Heart } from 'lucide-vue-next'

const likeRecipe = () => {
  alert('Recipe liked')
}
const dislikeRecipe = () => {
  alert('Recipe disliked')
}
</script>

<template>
  <div class="flex flex-col flex-1 justify-center">
    <section class="recipe-card flex flex-col gap-2">
      <img src="https://picsum.dev/200/100" />
      <div class="recipe-info flex flex-col gap-[4px]">
        <p class="medium">Pokebowl Salmon</p>
        <div class="flex gap-2">
          <!-- make duration, calories & difficulty into a RecipeInfo component taking a type of duration, calories or difficulty? -->
          <div class="duration flex gap-1 items-center">
            <Clock size="16" color="var(--text2)" />
            <span class="medium">25min</span>
          </div>
          <div class="carlories flex gap-1 items-center">
            <Apple size="16" color="var(--text2)" />
            <span class="medium">430kcal</span>
          </div>
          <div class="difficulty flex gap-1 items-center">
            <Star size="16" color="var(--text2)" />
            <span class="medium">Easy</span>
          </div>
        </div>
      </div>
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
}

button.dislike,
button.like {
  border-radius: 100%;
  padding: 12px;
}
</style>
