<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'
const router = useRouter()

import { Plus, X } from 'lucide-vue-next'

import { useUserStore } from '@/stores/user'
import LazyImage from './LazyImage.vue'
const userStore = useUserStore()

const newRecipe = ref<Partial<Recipe>>({
  name: '',
  image_url: '',
  duration: 0,
  difficulty: '',
  calories: 0,
})

const ingredients = ref<{ name: string; amount: string }[]>([])
const addIngredient = () => {
  ingredients.value.push({ name: '', amount: '' })
}

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1)
}

const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const handleFileChange = (e: Event) => {
  // when user adds an image, set that to file.value...
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      previewUrl.value = reader.result as string
    }
    reader.readAsDataURL(file.value)
  }
}

const loading = ref(false)
const error = ref<string | null>(null)

const addRecipe = async () => {
  // check whether user is logged in...
  if (!userStore.user) {
    error.value = 'You must be logged in to add a recipe'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  let imageUrl = ''

  if (file.value) {
    const fileExt = file.value.name.split('.').pop()
    const fileName = `${userStore.user?.id}_${Date.now()}.${fileExt}`
    console.log(fileName)

    // upload file to supabase bucket...
    const { error: urlError } = await supabase.storage
      .from('recipe_images')
      .upload(fileName, file.value)

    if (urlError) {
      error.value = urlError.message
      loading.value = false
      return
    }

    // get public url...
    const { data: publicData } = supabase.storage.from('recipe_images').getPublicUrl(fileName)
    imageUrl = publicData?.publicUrl ?? ''
  }

  // insert recipe into Supabase
  const { error: insertError } = await supabase.from('recipes').insert([
    {
      ...newRecipe.value,
      image_url: imageUrl,
      ingredients: ingredients.value,
      created_by: userStore.user.id,
    },
  ])

  if (insertError) {
    error.value = insertError.message
  } else {
    newRecipe.value = { name: '', image_url: '', duration: 0, difficulty: '', calories: 0 } // clear values...
    ingredients.value = []
    file.value = null
    // #TODO inform the user that the recipe has been added to the deck!
    router.push('/') // back to deck
  }

  loading.value = false
}
</script>

<template>
  <div id="add-recipe">
    <form @submit.prevent="addRecipe" class="flex flex-col gap-2">
      <!-- Recipe name -->
      <input
        v-model="newRecipe.name"
        type="text"
        placeholder="Name of recipe..."
        class="w-full border rounded p-2"
        required
      />

      <!-- Image -->
      <div>
        <label class="image-dropzone tile flex flex-col justify-center items-center">
          <input type="file" accept="image/*" @change="handleFileChange" class="hidden" />

          <div v-if="previewUrl">
            <LazyImage :src="previewUrl" alt="Preview of your uploaded recipe image" />
          </div>

          <div v-else class="dropzone-content flex flex-col items-center">
            <Plus :size="16" class="text2 opacity-75" />
            <span class="medium opacity-75">Add an image</span>
          </div>
        </label>
      </div>

      <!-- Duration -->
      <input
        v-model.number="newRecipe.duration"
        type="number"
        placeholder="Duration in minutes..."
        class="w-full border rounded p-2"
      />

      <!-- Difficulty -->
      <select v-model="newRecipe.difficulty">
        <option disabled value="">Difficulty...</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <!-- Calories -->
      <input v-model.number="newRecipe.calories" type="number" placeholder="Calories..." />

      <!-- Ingredients -->
      <div class="ingredients flex flex-col gap-2">
        <label class="medium opacity-75">Ingredients</label>
        <div v-for="(ingredient, index) in ingredients" :key="index" class="flex gap-2">
          <input
            v-model="ingredient.name"
            type="text"
            placeholder="Ingredient name..."
            class="flex-1"
          />
          <input v-model="ingredient.amount" class="flex-1" type="text" placeholder="Amount..." />
          <button @click="removeIngredient(index)">
            <X :size="16" class="text2" />
          </button>
        </div>
        <button type="button" class="w-fit" @click="addIngredient">Add ingredient</button>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="primary flex justify-center"
        :disabled="loading || !userStore.user"
      >
        {{ loading ? 'Adding to deck...' : 'Add to deck' }}
      </button>
    </form>

    <span class="text-center w-full block pt-2 opacity-50"
      >Your recipe will be visible to all users</span
    >

    <!-- Error message -->
    <span v-if="error" class="text-red-500 mt-4">{{ error }}</span>
  </div>
</template>

<style scoped>
input,
select {
  font-weight: 500;
  color: var(--text2);
}

.image-dropzone {
  background-color: var(--background3);
  min-height: 7em;
  transition: var(--transition);
}

.image-dropzone:hover {
  background-color: var(--background2);
  cursor: pointer;
}

:deep(.lazy-image img) {
  aspect-ratio: unset;
}
</style>
