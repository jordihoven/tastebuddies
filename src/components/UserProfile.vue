<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

// reactive states...
const step = ref('email')
const email = ref('')
const otp = ref('')
const loading = ref(false)

onMounted(async () => {
  const { data, error } = await supabase.auth.getUser()
  if (!error) {
    userStore.user = data.user
  }
})

const sendOtp = async () => {
  if (!email.value) return alert('Enter email...')

  loading.value = true

  const { error } = await supabase.auth.signInWithOtp({ email: email.value })

  loading.value = false

  if (error) {
    alert(error.message)
  } else {
    step.value = 'code' // move to code step...
  }
}

const verifyOtp = async () => {
  if (!otp.value) return alert('Enter code...')
  loading.value = true

  const { data, error } = await supabase.auth.verifyOtp({
    email: email.value,
    token: otp.value,
    type: 'email',
  })
  loading.value = false

  if (error) {
    alert(error.message)
  } else {
    if (!data.user) {
      alert('Login failed: no user in supabase...')
      return
    }
    userStore.setUser(data.user)
    await syncLocalStorageToSupabase(data.user.id)
    step.value = '' // reset step, maybe not needed?
  }
}

const syncLocalStorageToSupabase = async (userId: string) => {
  const SAVED_KEY = 'likedRecipes'
  const localRecipeIds: string[] = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
  if (!localRecipeIds.length) return

  // insert only the ids not already in supabase
  const { data: existing, error } = await supabase
    .from('saved_recipes')
    .select('recipe_id')
    .eq('user_id', userId)
    .in('recipe_id', localRecipeIds)

  if (error) {
    console.error('Error checking existing saved recipes in supabase: ', error)
    return
  }

  const existingIds = existing.map((recipes) => recipes.recipe_id)
  const newIds = localRecipeIds.filter((id) => !existingIds.includes(id))

  if (newIds.length) {
    const { error: insertError } = await supabase
      .from('saved_recipes')
      .insert(newIds.map((id) => ({ user_id: userId, recipe_id: id })))
    if (insertError) console.error('Error syncing: ', insertError)
  }

  localStorage.removeItem(SAVED_KEY)
}

const logoutUser = async () => {
  await userStore.logout()
  email.value = ''
  otp.value = ''
  step.value = 'email'
}

// regex email validator...
const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

const formatUsername = (email: any) => {
  return email ? email.split('@')[0].slice(0, 2).toUpperCase() : '??'
}
</script>

<template>
  <div class="profile-page">
    <div v-if="!userStore.user">
      <div v-if="step === 'email'" class="flex flex-col gap-2 step">
        <p class="text2 text-center">Sign up to save recipes and improve your matches.</p>
        <input type="email" v-model="email" placeholder="Enter email address" />
        <button
          @click="sendOtp"
          :disabled="loading || !isEmailValid"
          class="flex justify-center primary"
        >
          {{ loading ? 'Sending code...' : 'Send Code' }}
        </button>
      </div>
      <div v-else-if="step === 'code'" class="flex flex-col gap-2 step">
        <p class="text2 text-center">
          Enter the 6 digit code send to <span class="primary mail-check-text">{{ email }}</span>
        </p>
        <input
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          v-model="otp"
          placeholder="Code from email"
        />
        <button @click="verifyOtp" :disabled="loading" class="flex justify-center primary">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <span class="text-center"
          >Check your inbox and spam folder — it may take a few minutes to arrive.</span
        >
      </div>
    </div>
    <div v-else class="flex flex-col gap-2 items-center">
      <div class="avatar">
        <span class="medium"> {{ formatUsername(userStore.user.email) }}</span>
      </div>
      <p class="text2 text-center">{{ userStore.user.email }}</p>
      <button @click="logoutUser" class="w-fit">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.step {
  max-width: 25em;
  margin: 0 auto;
}
.avatar {
  border: var(--border);
  border-radius: 50px;
  padding: var(--xs-spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background2);
  transition: var(--transition);
  position: relative;
  height: 3rem;
  width: 3rem;
}

.mail-check-text {
  font-size: var(--1rem);
}
</style>
