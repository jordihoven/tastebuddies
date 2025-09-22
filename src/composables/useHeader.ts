import { reactive, computed } from 'vue'

export type Action =
  | {
      icon: any // :component...
      onClick: () => void
    }
  | 'back' // route back logic is handled in appHeader...

const state = reactive<{ leftAction: Action | null; rightActions: Action[] }>({
  leftAction: null,
  rightActions: [],
})

export function useHeader() {
  const leftAction = computed(() => state.leftAction)
  const rightActions = computed(() => state.rightActions)

  function setHeader(config: {
    leftAction?: Action | null
    rightAction?: Action | null
    rightActions?: Action[]
  }) {
    state.leftAction = config.leftAction ?? null
    state.rightActions = config.rightActions ?? []
  }

  function clearHeader() {
    state.leftAction = null
    state.rightActions = []
  }

  return { leftAction, rightActions, setHeader, clearHeader }
}
