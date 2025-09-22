import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './user'

export const useRecipeStore = defineStore('recipe', () => {
  const userStore = useUserStore()
  const recipes = ref<Recipe[]>([])
  const likedRecipes = ref<Recipe[]>([])
  const dislikedRecipes = ref<Recipe[]>([])
  const isLoading = ref(false)

  const currentRecipe = computed(() => recipes.value[0] ?? null)

  async function getRecipesForDeck() {
    isLoading.value = true
    const { data, error } = await supabase.from('recipes').select('*') // fetch all recipes from recipes table...

    if (error) {
      console.error(error)
      return
    }

    recipes.value = shuffle(data ?? []) // update recipes state & shuffle...
    isLoading.value = false
  }

  const getRecipeById = async (id: string): Promise<Recipe | null> => {
    isLoading.value = true
    errorAddingOrUpdating.value = null

    try {
      const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single()

      if (error || !data) {
        console.error('Failed to fetch recipe by ID:', error)
        return null
      }

      return data
    } catch (err: any) {
      console.error('Error fetching recipe by ID:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const likeRecipe = async () => {
    const recipe = recipes.value.shift() // remove the liked recipe from the recipes deck...
    if (!recipe) return
    likedRecipes.value.push(recipe) // add recipe to likedRecipe array...
    return recipe
  }
  const dislikeRecipe = () => {
    const recipe = recipes.value.shift() // remove the recipe from the array...
    if (!recipe) return
    dislikedRecipes.value.push(recipe)
  }

  // Fisher-Yates shuffle...
  function shuffle(array: any) {
    const copy = [...array]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }

  const errorAddingOrUpdating = ref<string | null>(null)

  const addOrUpdateRecipe = async (recipe: Partial<Recipe>, file: File | null, user: User) => {
    isLoading.value = true
    errorAddingOrUpdating.value = null // suss...
    let imageUrl = recipe.image_url ?? ''

    const created_by_name = userStore.user?.email?.split('@')[0] || 'Anon'

    try {
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('recipe_images')
          .upload(fileName, file)
        if (uploadError) throw uploadError
        const { data: publicData } = supabase.storage.from('recipe_images').getPublicUrl(fileName)
        imageUrl = publicData?.publicUrl ?? ''
      }
      // insert or update
      let savedData
      if (recipe.id) {
        const { data, error: updateError } = await supabase
          .from('recipes')
          .update({ ...recipe, image_url: imageUrl, created_by_name })
          .eq('id', recipe.id)
          .select()
        if (updateError) throw updateError
        savedData = data
      } else {
        const { data, error: insertError } = await supabase
          .from('recipes')
          .insert([{ ...recipe, image_url: imageUrl, created_by: user.id, created_by_name }])
          .select()
        if (insertError) throw insertError
        savedData = data
      }
      return savedData?.[0] ?? null
    } catch (error: any) {
      errorAddingOrUpdating.value = error.message || 'Something went wrong'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteRecipeById = async (id: string) => {
    isLoading.value = true
    try {
      const { error } = await supabase.from('recipes').delete().eq('id', id)
      if (error) throw error
      return true
    } catch (error: any) {
      console.error('Error deleting recipe: ', error.message)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    recipes,
    getRecipesForDeck,
    getRecipeById,
    currentRecipe,
    isLoading,
    likeRecipe,
    dislikeRecipe,
    addOrUpdateRecipe,
    errorAddingOrUpdating,
    deleteRecipeById,
  }
})
