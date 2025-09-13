import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const savedRecipes = ref<Recipe[]>([]) // this will be populated by LocalStorage for guest users... #TODO: decide whether that makes sense
  const SAVED_KEY = 'likedRecipes'
  const myRecipes = ref<Recipe[]>([])

  // watcher needed to re-trigger fetching recipes since the userStore.user object isn't loaded fast enough... #TODO: move logic to store
  watch(user, () => {
    fetchSavedRecipes()
    fetchMyRecipes()
  })

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (!error) user.value = data.user
  }

  const setUser = (u: User | null) => {
    user.value = u
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  // fetch the users's saved recipes...
  const fetchSavedRecipes = async () => {
    if (user.value) {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('recipe_id')
        .eq('user_id', user.value?.id)

      if (error) {
        console.error('Error: ', error)
        return
      }

      const recipeIds = data.map((d) => d.recipe_id)
      if (!recipeIds.length) return

      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds)

      if (!recipesError) savedRecipes.value = recipesData ?? []
    } else {
      // Guest → localStorage
      const recipeIds = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
      if (!recipeIds.length) return

      const { data, error } = await supabase.from('recipes').select('*').in('id', recipeIds)
      if (!error) savedRecipes.value = data ?? []
    }
  }

  const fetchMyRecipes = async () => {
    console.log('fetching created recipes of this user...')

    if (!user.value) {
      // if guest user...
      myRecipes.value = []
      return
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('created_by', user.value.id)

    if (error) {
      console.error('Error fetching user recipes: ', error)
      myRecipes.value = []
      return
    }

    myRecipes.value = data ?? [] // populate myRecipes if supabase returned any, otherwise set it to an empty array...
  }

  const saveRecipe = async (recipeId: string) => {
    if (user.value) {
      // logged in user -> save to SupaBase...
      const { error } = await supabase
        .from('saved_recipes')
        .insert({ user_id: user?.value.id, recipe_id: recipeId })

      if (error) {
        console.error(error)
        return
      }
    } else {
      // guest user -> save to LocalStorage...
      const recipeIds = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
      if (!recipeIds.includes(recipeId)) {
        recipeIds.push(recipeId)
        localStorage.setItem(SAVED_KEY, JSON.stringify(recipeIds))
      }
    }

    // refresh so savedRecipes stays in sync...
    await fetchSavedRecipes()
  }

  const hasSavedRecipe = (recipeId: string) => {
    return savedRecipes.value.some((r) => r.id === recipeId)
  }

  return {
    user,
    savedRecipes,
    fetchUser,
    fetchSavedRecipes,
    myRecipes,
    fetchMyRecipes,
    saveRecipe,
    setUser,
    logout,
    hasSavedRecipe,
  }
})
