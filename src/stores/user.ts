import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const savedRecipes = ref<Recipe[]>([]) // this will be populated by LocalStorage for guest users... #TODO: decide whether that makes sense
  const SAVED_KEY = 'likedRecipes'

  // watcher needed to re-trigger fetching recipes since the userStore.user object isn't loaded fast enough... #TODO: move logic to store
  watch(user, () => {
    fetchSavedRecipes()
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

  return { user, savedRecipes, fetchUser, fetchSavedRecipes, setUser, logout }
})
