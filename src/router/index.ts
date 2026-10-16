import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/swipe' },
    {
      path: '/profile',
      component: () => import('@/components/UserProfile.vue'),
      meta: { title: 'Profile' },
    },
    {
      path: '/recipes',
      component: () => import('@/components/UserRecipes.vue'),
      meta: { title: 'Recipes' },
    },
    {
      path: '/swipe',
      component: () => import('@/components/SwipeRecipes.vue'),
      meta: { title: 'Swipe' },
    },
    {
      path: '/addrecipe',
      component: () => import('@/components/AddRecipe.vue'),
      meta: { title: 'Add Recipe', hideTabBar: true },
    },
    {
      path: '/recipe/:id',
      component: () => import('@/components/RecipeDetails.vue'),
      meta: { title: 'Recipe', hideTabBar: true },
    },
  ],
})

export default router
