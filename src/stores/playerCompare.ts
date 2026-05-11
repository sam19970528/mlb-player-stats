import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Mode = 'batting' | 'pitching'
export type League = 'AL' | 'NL'

export interface ModeSelection {
  leagueA: League
  leagueB: League
  teamA: number | null
  teamB: number | null
  playerA: number | null
  playerB: number | null
}

const emptySelection = (): ModeSelection => ({
  leagueA: 'AL',
  leagueB: 'NL',
  teamA: null,
  teamB: null,
  playerA: null,
  playerB: null,
})

export const usePlayerCompareStore = defineStore(
  'playerCompare',
  () => {
    const mode = ref<Mode>('batting')
    const season = ref(new Date().getFullYear())
    const batting = ref<ModeSelection>(emptySelection())
    const pitching = ref<ModeSelection>(emptySelection())
    return { mode, season, batting, pitching }
  },
  {
    persist: {
      pick: ['season', 'batting', 'pitching'],
    },
  },
)
