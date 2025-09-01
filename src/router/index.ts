import { createRouter, createWebHistory } from 'vue-router'

import UserProfile from '@/components/UserProfile.vue'
import UserRecipes from '@/components/UserRecipes.vue'
import SwipeRecipes from '@/components/SwipeRecipes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/swipe' },
    { path: '/profile', component: UserProfile, meta: { title: 'Profile' } },
    { path: '/recipes', component: UserRecipes, meta: { title: 'Recipes' } },
    { path: '/swipe', component: SwipeRecipes, meta: { title: 'Swipe' } },
  ],
})

export default router
