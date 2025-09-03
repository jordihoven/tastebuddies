import { watchEffect, onMounted } from 'vue'

export function useThemeColor(cssVarName: string = '--background1') {
  const metaId = 'theme-color-meta'

  function updateMeta() {
    let meta = document.querySelector(`meta[name="theme-color"]#${metaId}`) as HTMLMetaElement

    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      meta.setAttribute('id', metaId)
      document.head.appendChild(meta)
    }

    const color = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim()

    if (color) {
      meta.setAttribute('content', color)
    }
  }

  onMounted(() => {
    updateMeta()
  })

  // optional: auto-update whenever CSS variable changes
  watchEffect(() => {
    updateMeta()
  })
}
