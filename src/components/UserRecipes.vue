<template>
  <div class="recipes-grid">
    <div class="recipe" v-for="recipe in recipes" :key="recipe.id">
      <p>{{ recipe.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.ts'

onMounted(async () => {
  const { data, error } = await supabase.from('recipes').select('*')
  if (error) console.error(error)
  else recipes.value = data
})

interface Recipe {
  id: string
  name: string
}
const recipes = ref<Recipe[]>([])
</script>

<style scoped>
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--xs-spacing);
}

.recipe {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  padding: var(--xs-spacing);
  background-color: var(--background2);
  border-radius: var(--radius);
  border: 1px solid var(--stroke);
  transition: var(--transition);
}

.recipe:hover {
  cursor: pointer;
}

@media only screen and (max-width: 660px) {
  .recipes-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
