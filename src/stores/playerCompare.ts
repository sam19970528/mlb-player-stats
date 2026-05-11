import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Mode = 'batting' | 'pitching'

export const usePlayerCompareStore = defineStore('playerCompare', () => {
  const mode = ref<Mode>('batting')
  const season = ref(new Date().getFullYear())
  return { mode, season }
})
