import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (!error) user.value = data.user
  }

  const setUser = (u: any) => {
    user.value = u
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, fetchUser, setUser, logout }
})
