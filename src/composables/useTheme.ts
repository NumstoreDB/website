import { ref, onMounted, onUnmounted } from 'vue'

export function useTheme() {
  const isDark = ref(
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false,
  )

  let observer: MutationObserver | null = null

  onMounted(() => {
    observer = new MutationObserver(() => {
      isDark.value = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  })

  onUnmounted(() => observer?.disconnect())

  return { isDark }
}
