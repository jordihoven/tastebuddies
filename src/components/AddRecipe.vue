<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'

import { useRouter } from 'vue-router'
const router = useRouter()

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

import { ImagePlus, X, Check } from 'lucide-vue-next'

import LazyImage from './LazyImage.vue'

import { useHeader } from '@/composables/useHeader'
const { setHeader, clearHeader } = useHeader()

const newRecipe = ref<Partial<Recipe>>({
  name: '',
  image_url: '',
  duration: undefined,
  difficulty: '',
  calories: undefined,
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

  const created_by_name = userStore.user?.email?.split('@')[0] || 'Anon'

  // insert recipe into Supabase
  const { data: insertedData, error: insertError } = await supabase
    .from('recipes')
    .insert([
      {
        ...newRecipe.value,
        image_url: imageUrl,
        ingredients: ingredients.value,
        created_by: userStore.user.id,
        created_by_name,
      },
    ])
    .select() // returns the selected row...

  if (insertError) {
    error.value = insertError.message
  } else {
    const newRecipeId = insertedData[0].id

    newRecipe.value = { name: '', image_url: '', duration: 0, difficulty: '', calories: 0 } // clear values...
    ingredients.value = []
    file.value = null

    router.push(`/recipe/${newRecipeId}`) // route user to the new recipe...
  }

  loading.value = false
}

onMounted(() => {
  setHeader({
    leftAction: 'back',
    rightAction: {
      icon: Check,
      onClick: addRecipe,
    },
  })
})

onUnmounted(clearHeader)
</script>

<template>
  <div id="add-recipe" class="flex flex-col h-full">
    <form @submit.prevent="addRecipe" class="flex flex-col gap-2 flex-1">
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
            <ImagePlus :size="20" class="text2 opacity-75" />
            <span class="medium opacity-75">Add an image</span>
          </div>
        </label>
      </div>

      <label>Duration</label>
      <input
        v-model.number="newRecipe.duration"
        type="number"
        placeholder="Duration in minutes..."
        class="w-full border rounded p-2"
      />

      <label>Difficulty</label>
      <select v-model="newRecipe.difficulty" :class="{ placeholder: !newRecipe.difficulty }">
        <option disabled value="">Difficulty...</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <label>Calories</label>
      <input v-model.number="newRecipe.calories" type="number" placeholder="Calories in kcal..." />

      <div class="flex flex-col gap-2">
        <label>Ingredients</label>
        <div class="tile ingredients flex flex-col gap-2">
          <div
            v-for="(ingredient, index) in ingredients"
            :key="index"
            class="flex gap-2 items-center"
          >
            <input
              v-model="ingredient.name"
              type="text"
              placeholder="Ingredient name..."
              class="flex-1 w-full"
            />
            <input
              v-model="ingredient.amount"
              class="flex-1 w-full"
              type="text"
              placeholder="Amount..."
            />
            <button @click="removeIngredient(index)" class="remove-button">
              <X :size="16" class="text2" />
            </button>
          </div>
          <button type="button" class="justify-center text2" @click="addIngredient">
            Add ingredient
          </button>
        </div>
      </div>
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
  min-height: 7em;
  transition: var(--transition);
}

.image-dropzone:hover,
select:hover {
  border: 1px solid var(--primary);
  box-shadow: 0px 0px 4px var(--primary);
  cursor: pointer;
}

:deep(.lazy-image img) {
  aspect-ratio: unset;
}

/* mute the select placeholder color... */
select.placeholder {
  color: color-mix(in srgb, var(--text2) 30%, gray 30%);
}

label {
  font-size: var(--span);
  color: var(--text2);
}

.ingredients input,
.ingredients .remove-button {
  border: none;
}
</style>
