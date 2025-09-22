<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ImagePlus, X, Check } from 'lucide-vue-next'
import LazyImage from './LazyImage.vue'
import { useHeader } from '@/composables/useHeader'
import { useRecipeStore } from '@/stores/recipe'

const { setHeader, clearHeader } = useHeader()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const recipeStore = useRecipeStore()

const newRecipe = ref<Partial<Recipe>>({
  name: '',
  image_url: '',
  duration: undefined,
  difficulty: '',
  calories: undefined,
  ingredients: [],
})

const editId = route.query.editId as string | undefined // getting recipe id from route...

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

const error = ref<string | null>(null)

const handleSave = async () => {
  if (!userStore.user) {
    error.value = 'You must be logged in'
    return
  }
  const savedRecipe = await recipeStore.addOrUpdateRecipe(
    newRecipe.value,
    file.value,
    userStore.user,
  )
  if (savedRecipe) router.push(`/recipe/${savedRecipe.id}`)
}

onMounted(async () => {
  if (editId) {
    // if there is an editId, fetch the recipe and populate the inputs...
    const recipe = await recipeStore.getRecipeById(editId)
    if (recipe) {
      newRecipe.value = { ...recipe }
      previewUrl.value = recipe.image_url || null
    }
  }
  setHeader({
    leftAction: 'back',
    rightActions: [
      {
        icon: Check,
        onClick: handleSave,
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
    <form @submit.prevent="handleSave" class="flex flex-col gap-2 flex-1">
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
