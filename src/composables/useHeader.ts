import { reactive, computed } from 'vue'

export type Action =
  | {
      icon: any // :component...
      onClick: () => void
    }
  | 'back' // route back logic is handled in appHeader...

const state = reactive<{ leftAction: Action | null; rightAction: Action | null }>({
  leftAction: null,
  rightAction: null,
})

export function useHeader() {
  const leftAction = computed(() => state.leftAction)
  const rightAction = computed(() => state.rightAction)

  function setHeader(config: { leftAction?: Action | null; rightAction?: Action | null }) {
    state.leftAction = config.leftAction ?? null
    state.rightAction = config.rightAction ?? null
  }

  function clearHeader() {
    state.leftAction = null
    state.rightAction = null
  }

  return { leftAction, rightAction, setHeader, clearHeader }
}
