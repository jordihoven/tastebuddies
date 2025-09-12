<script setup lang="ts">
const props = defineProps({
  icon: Object,
  title: String,
  description: String,
  buttonText: String,
})
</script>

<template>
  <div class="empty-state flex flex-col gap-2 text-center items-center">
    <div class="flex flex-col gap-1 items-center">
      <component v-if="props.icon" :is="props.icon" :size="32" class="muted-color" />
      <p class="medium">{{ props.title }}</p>
      <span>{{ props.description }}</span>
    </div>
    <button v-if="props.buttonText" class="primary">{{ props.buttonText }}</button>
  </div>
</template>

<style scoped>
.muted-color {
  color: #a3a3a3;
}
</style>
