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
    userStore.setUser(data.user)
    step.value = '' // reset step, maybe not needed?
  }
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
</script>

<template>
  <div class="profile-page">
    <div v-if="!userStore.user">
      <div v-if="step === 'email'" class="flex flex-col gap-2">
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
      <div v-else-if="step === 'code'">
        <p>Enter the 6 digit code</p>
        <input type="text" v-model="otp" placeholder="Code from email" />
        <button @click="verifyOtp" :disabled="loading" class="flex justify-center primary">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </div>
    <div v-else class="flex flex-col gap-2 items-center">
      <p class="text2 text-center">{{ userStore.user.email }}</p>
      <button @click="logoutUser" class="w-fit">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 40em;
  margin: 0 auto;
}
</style>
