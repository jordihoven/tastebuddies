<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabase.ts'

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

<template>
  <p>Tastebuddies</p>
  <ul>
    <li v-for="r in recipes" :key="r.id">{{ r.name }}</li>
  </ul>
</template>

<style scoped></style>
