<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

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
  ingredients: [],
})

// getting recipe id from route...
const editId = route.query.editId as string | undefined

// fetching the recipe to be edited from supabase on id...
const fetchRecipeFromId = async (recipeIdFromRouter: string) => {
  const { data: recipeData, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeIdFromRouter)
    .single() // fetch the recipe to edit...

  if (error || !recipeData) {
    console.error('Failed to fetch recipe from id for edit: ', error)
  }

  newRecipe.value = { ...recipeData }
  previewUrl.value = recipeData.image_url || null
}

const addIngredient = () => {
  newRecipe.value.ingredients?.push({ name: '', amount: '' })
}

const removeIngredient = (index: number) => {
  newRecipe.value.ingredients?.splice(index, 1)
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
      newRecipe.value.image_url = reader.result as string // updating the image_url for vuedevtools...
    }
    reader.readAsDataURL(file.value)
  }
}

const loading = ref(false)
const error = ref<string | null>(null)

const addRecipe = async () => {
  // check whether user is logged in...
  if (!userStore.user) {
    error.value = 'You must be logged in to add a recipe...'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  let imageUrl = ''

  if (file.value) {
    const fileExt = file.value.name.split('.').pop()
    const fileName = `${userStore.user?.id}_${Date.now()}.${fileExt}`

    // upload file to supabase bucket...
    const { error: uploadError } = await supabase.storage
      .from('recipe_images')
      .upload(fileName, file.value)

    if (uploadError) {
      error.value = uploadError.message
      loading.value = false
      return
    }

    // get public url...
    const { data: publicData } = supabase.storage.from('recipe_images').getPublicUrl(fileName)
    imageUrl = publicData?.publicUrl ?? ''
    newRecipe.value.image_url = imageUrl // set the fetched imageUrl from supabase to the newRecipe...
  }

  const created_by_name = userStore.user?.email?.split('@')[0] || 'Anon'

  try {
    let savedData

    if (editId) {
      // update the existing recipe...
      const { data, error: updateError } = await supabase
        .from('recipes')
        .update({ ...newRecipe.value, created_by_name })
        .eq('id', editId)
        .select()

      if (updateError) throw updateError

      savedData = data
    } else {
      // insert recipe into Supabase
      const { data, error: insertError } = await supabase
        .from('recipes')
        .insert([
          {
            ...newRecipe.value,
            created_by: userStore.user.id,
            created_by_name,
          },
        ])
        .select() // returns the selected row...

      if (insertError) throw insertError
      savedData = data
    }

    const recipeId = savedData[0].id
    //const newRecipeId = insertedData[0].id

    // clear values...
    newRecipe.value = {
      name: '',
      image_url: '',
      duration: 0,
      difficulty: '',
      calories: 0,
      ingredients: [],
    }
    file.value = null

    router.push(`/recipe/${recipeId}`) // route user to the new recipe...
  } catch (err: any) {
    error.value = err.message || 'Something went wrong...'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (editId) fetchRecipeFromId(editId) // if theres a editId in the route, fetch the recipe data from supabase...
  setHeader({
    leftAction: 'back',
    rightActions: [
      {
        icon: Check,
        onClick: addRecipe,
      },
    ],
  })
})

onUnmounted(clearHeader)
</script>

<template>
  <div id="add-recipe" class="flex flex-col h-full">
    <!-- Error message -->
    <span v-if="error" class="pb-4 text-center">{{ error }}</span>
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
            v-for="(ingredient, index) in newRecipe.ingredients"
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
