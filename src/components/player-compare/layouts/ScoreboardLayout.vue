<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import YearSelect from '@/components/player-compare/common/YearSelect.vue'
import {
  fetchBattingStats,
  fetchPerson,
  fetchPitchingStats,
  fetchRoster,
  fetchTeams,
} from '@/api/mlb'
import {
  DEFAULT_BATTING_PAIR,
  DEFAULT_PITCHING_PAIR,
} from '@/constants/player-compare'
import { TEAM_NAMES_TW } from '@/constants/mlb-teams'
import { usePlayerCompareStore, type Mode } from '@/stores/playerCompare'

type League = 'AL' | 'NL'

interface Team {
  id: number
  name: string
  league: { id: number; name: string }
}

interface RosterItem {
  person: { id: number; fullName: string }
  jerseyNumber: string
  position: { abbreviation: string }
}

interface BattingStat {
  avg: string
  hits: number
  homeRuns: number
  baseOnBalls: number
  ops: string
}

interface Person {
  id: number
  batSide?: { code: string }
  pitchHand?: { code: string }
  height?: string
}

interface PitchingStat {
  era: string
  whip: string
  strikeOuts: number
  inningsPitched: string
  wins: number
}

type Stat = BattingStat | PitchingStat

const store = usePlayerCompareStore()
const { mode, season } = storeToRefs(store)

const filterRosterByMode = (roster: RosterItem[], m: Mode) => {
  if (m === 'batting') {
    return roster.filter((r) => r.position.abbreviation !== 'P')
  }
  return roster.filter(
    (r) =>
      r.position.abbreviation === 'P' || r.position.abbreviation === 'TWP',
  )
}

const teams = ref<Team[]>([])
const rosterA = ref<RosterItem[]>([])
const rosterB = ref<RosterItem[]>([])

const leagueA = ref<League>('NL')
const leagueB = ref<League>('AL')

const selectedTeamA = ref<number | null>(null)
const selectedTeamB = ref<number | null>(null)
const selectedPlayerA = ref<number | null>(null)
const selectedPlayerB = ref<number | null>(null)

const statA = ref<Stat | null>(null)
const statB = ref<Stat | null>(null)

const personA = ref<Person | null>(null)
const personB = ref<Person | null>(null)

const leagueFullName = (l: League) =>
  l === 'AL' ? 'American League' : 'National League'

const teamOptionsA = computed(() =>
  teams.value.filter((t) => t.league.name === leagueFullName(leagueA.value)),
)
const teamOptionsB = computed(() =>
  teams.value.filter((t) => t.league.name === leagueFullName(leagueB.value)),
)

const rosterOptionsA = computed(() =>
  filterRosterByMode(rosterA.value, mode.value),
)
const rosterOptionsB = computed(() =>
  filterRosterByMode(rosterB.value, mode.value),
)

const headshotUrl = (id: number) =>
  `https://img.mlbstatic.com/mlb-photos/image/upload/w_213,q_auto:best/v1/people/${id}/headshot/silo/current.png`

const buildPlayerView = (
  roster: RosterItem[],
  selectedId: number | null,
) => {
  const item = roster.find((r) => r.person.id === selectedId)
  if (!item) return null
  return {
    id: item.person.id,
    fullName: item.person.fullName,
    jerseyNumber: item.jerseyNumber,
    headshot: headshotUrl(item.person.id),
  }
}

const playerA = computed(() => buildPlayerView(rosterA.value, selectedPlayerA.value))
const playerB = computed(() => buildPlayerView(rosterB.value, selectedPlayerB.value))

let initialLoad = true

const reloadRoster = async (
  teamId: number | null,
  rosterRef: typeof rosterA,
) => {
  if (teamId == null) {
    rosterRef.value = []
    return
  }
  try {
    const res = await fetchRoster(teamId, season.value)
    rosterRef.value = res.roster ?? []
  } catch (err) {
    console.error(err)
    rosterRef.value = []
  }
}

const reloadStat = async (
  playerId: number | null,
  statRef: typeof statA,
) => {
  if (playerId == null) {
    statRef.value = null
    return
  }
  const fetcher =
    mode.value === 'batting' ? fetchBattingStats : fetchPitchingStats
  try {
    const res = await fetcher(playerId, season.value)
    statRef.value = res.stats?.[0]?.splits?.[0]?.stat ?? null
  } catch (err) {
    console.error(err)
    statRef.value = null
  }
}

watch(leagueA, () => {
  if (initialLoad) return
  selectedTeamA.value = null
})

watch(leagueB, () => {
  if (initialLoad) return
  selectedTeamB.value = null
})

watch(selectedTeamA, async (newId) => {
  if (initialLoad) return
  selectedPlayerA.value = null
  rosterA.value = []
  await reloadRoster(newId, rosterA)
})

watch(selectedTeamB, async (newId) => {
  if (initialLoad) return
  selectedPlayerB.value = null
  rosterB.value = []
  await reloadRoster(newId, rosterB)
})

const reloadPerson = async (
  playerId: number | null,
  personRef: typeof personA,
) => {
  if (playerId == null) {
    personRef.value = null
    return
  }
  try {
    const res = await fetchPerson(playerId)
    personRef.value = res.people?.[0] ?? null
  } catch (err) {
    console.error(err)
    personRef.value = null
  }
}

watch(selectedPlayerA, (newId) => {
  if (initialLoad) return
  reloadStat(newId, statA)
  reloadPerson(newId, personA)
})

watch(selectedPlayerB, (newId) => {
  if (initialLoad) return
  reloadStat(newId, statB)
  reloadPerson(newId, personB)
})

const loadSeed = async (m: Mode) => {
  const pair = m === 'batting' ? DEFAULT_BATTING_PAIR : DEFAULT_PITCHING_PAIR
  leagueA.value = pair.a.league as League
  leagueB.value = pair.b.league as League
  selectedTeamA.value = pair.a.teamId
  selectedTeamB.value = pair.b.teamId
  const [rosterARes, rosterBRes] = await Promise.all([
    fetchRoster(pair.a.teamId, season.value),
    fetchRoster(pair.b.teamId, season.value),
  ])
  rosterA.value = rosterARes.roster ?? []
  rosterB.value = rosterBRes.roster ?? []
  selectedPlayerA.value = pair.a.playerId
  selectedPlayerB.value = pair.b.playerId
  await Promise.all([
    reloadStat(pair.a.playerId, statA),
    reloadStat(pair.b.playerId, statB),
    reloadPerson(pair.a.playerId, personA),
    reloadPerson(pair.b.playerId, personB),
  ])
}

watch(mode, async (m) => {
  if (initialLoad) return
  initialLoad = true
  try {
    await loadSeed(m)
  } catch (err) {
    console.error(err)
  } finally {
    initialLoad = false
  }
})

watch(season, async () => {
  if (initialLoad) return
  // 兩側 roster 重抓、若原球員不在新 roster → selectedPlayer = null
  await Promise.all([
    reloadRoster(selectedTeamA.value, rosterA),
    reloadRoster(selectedTeamB.value, rosterB),
  ])
  if (
    selectedPlayerA.value != null &&
    !rosterA.value.some((r) => r.person.id === selectedPlayerA.value)
  ) {
    selectedPlayerA.value = null
  }
  if (
    selectedPlayerB.value != null &&
    !rosterB.value.some((r) => r.person.id === selectedPlayerB.value)
  ) {
    selectedPlayerB.value = null
  }
  // 重抓兩側 stats（若 selectedPlayer 還在 → 抓新年份；若被清空 → reloadStat 內部會設成 null）
  await Promise.all([
    reloadStat(selectedPlayerA.value, statA),
    reloadStat(selectedPlayerB.value, statB),
  ])
})

onMounted(async () => {
  try {
    const teamsRes = await fetchTeams(season.value)
    teams.value = teamsRes.teams ?? []
    await loadSeed(mode.value)
  } catch (err) {
    console.error(err)
  } finally {
    initialLoad = false
  }
})

const handLabel = (hand: string) => (hand === 'L' ? '左' : '右')

// "6' 4\"" → 193cm
const heightToCm = (h: string) => {
  const m = h.match(/(\d+)'\s*(\d+)/)
  if (!m) return h
  const cm = Math.round(Number(m[1]) * 30.48 + Number(m[2]) * 2.54)
  return `${cm}cm`
}

const buildMeta = (p: Person | null) => {
  if (!p) return null
  return {
    bats: p.batSide?.code ?? '',
    throws: p.pitchHand?.code ?? '',
    height: p.height ? heightToCm(p.height) : '',
  }
}

const playerAMeta = computed(() => buildMeta(personA.value))
const playerBMeta = computed(() => buildMeta(personB.value))

interface StatRow {
  key: string
  labelEn: string
  labelTw: string
  lowerIsBetter?: boolean
}

const BATTING_ROWS: StatRow[] = [
  { key: 'avg', labelEn: 'AVG', labelTw: '打擊率' },
  { key: 'hits', labelEn: 'H', labelTw: '安打' },
  { key: 'homeRuns', labelEn: 'HR', labelTw: '全壘打' },
  { key: 'baseOnBalls', labelEn: 'BB', labelTw: '四壞球' },
  { key: 'ops', labelEn: 'OPS', labelTw: 'OPS' },
]

const PITCHING_ROWS: StatRow[] = [
  { key: 'wins', labelEn: 'W', labelTw: '勝場' },
  { key: 'inningsPitched', labelEn: 'IP', labelTw: '局數' },
  { key: 'era', labelEn: 'ERA', labelTw: '防禦率', lowerIsBetter: true },
  { key: 'whip', labelEn: 'WHIP', labelTw: 'WHIP', lowerIsBetter: true },
  { key: 'strikeOuts', labelEn: 'K', labelTw: '三振' },
]

const toNumber = (v: string | number) =>
  typeof v === 'number' ? v : parseFloat(v)

const stats = computed(() => {
  const rows = mode.value === 'batting' ? BATTING_ROWS : PITCHING_ROWS
  return rows.map((row) => {
    const rawA = (statA.value as Record<string, string | number> | null)?.[row.key]
    const rawB = (statB.value as Record<string, string | number> | null)?.[row.key]
    const valueA = rawA != null ? String(rawA) : '-'
    const valueB = rawB != null ? String(rawB) : '-'
    let winner: 'A' | 'B' | null = null
    if (rawA != null && rawB != null) {
      const numA = toNumber(rawA)
      const numB = toNumber(rawB)
      if (numA !== numB) {
        const aWins = row.lowerIsBetter ? numA < numB : numA > numB
        winner = aWins ? 'A' : 'B'
      }
    }
    return { ...row, valueA, valueB, winner }
  })
})
</script>

<template>
  <section class="bg-paper p-2 font-sans text-ink md:px-12 md:py-10">
    <!-- Scoreboard card -->
    <div class="relative overflow-hidden rounded-2xl border border-hairline bg-white p-3 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.12)] md:p-9">
      <!-- decorative gradient grain -->
      <div
        class="pointer-events-none absolute inset-0"
        :style="{
          backgroundImage:
            'radial-gradient(circle at 18% 0%, oklch(0.6 0.13 145 / 0.07), transparent 45%), radial-gradient(circle at 82% 100%, oklch(0.6 0.12 50 / 0.06), transparent 45%)',
        }"
      />

      <!-- Selectors row — aligned with hero columns -->
      <div class="relative mb-5 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-x-4 gap-y-3 md:grid-cols-[1fr_100px_1fr] md:items-center md:gap-6">
        <!-- Player A selectors -->
        <div class="flex w-full min-w-0 max-w-[130px] flex-col items-start gap-2 md:max-w-none md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-start">
          <!-- League segmented (AL / NL) -->
          <div class="relative grid grid-cols-2 rounded-full border border-[#d8d6c8] bg-[#f4f3ec] p-1">
            <span
              class="pointer-events-none absolute bottom-1 top-1 rounded-full bg-ink shadow-[0_2px_8px_-2px_rgba(0,0,0,0.25)] transition-[left] duration-300 ease-out"
              :style="{
                width: 'calc(50% - 8px)',
                left: leagueA === 'AL' ? '4px' : 'calc(50% + 4px)',
              }"
            />
            <button
              type="button"
              class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors"
              :class="leagueA === 'AL' ? 'text-paper' : 'text-[#5a5a52]'"
              @click="leagueA = 'AL'"
            >
              美聯
            </button>
            <button
              type="button"
              class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors"
              :class="leagueA === 'NL' ? 'text-paper' : 'text-[#5a5a52]'"
              @click="leagueA = 'NL'"
            >
              國聯
            </button>
          </div>
          <div class="relative inline-flex h-8.5 w-full min-w-0 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3 md:w-[180px] md:flex-none">
            <select
              v-model="selectedTeamA"
              class="w-full min-w-0 max-w-full appearance-none truncate border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none"
            >
              <option :value="null" disabled>請選擇球隊</option>
              <option v-for="t in teamOptionsA" :key="t.id" :value="t.id">
                {{ TEAM_NAMES_TW[t.id] ?? t.name }}
              </option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
          <div class="relative inline-flex h-8.5 w-full min-w-0 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3 md:w-[180px] md:flex-none">
            <select
              v-model="selectedPlayerA"
              class="w-full min-w-0 max-w-full appearance-none truncate border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none"
            >
              <option :value="null" disabled>請選擇球員</option>
              <option v-for="r in rosterOptionsA" :key="r.person.id" :value="r.person.id">
                {{ r.person.fullName }}
              </option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
        </div>

        <!-- Year (center, aligned with VS) - desktop only -->
        <div class="hidden items-center justify-center md:flex">
          <YearSelect v-model="season" />
        </div>

        <!-- Player B selectors -->
        <div class="flex w-full min-w-0 max-w-[130px] flex-col items-end gap-2 justify-self-end md:max-w-none md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-end md:justify-self-auto">
          <!-- League segmented (AL / NL) -->
          <div class="relative grid grid-cols-2 rounded-full border border-[#d8d6c8] bg-[#f4f3ec] p-1">
            <span
              class="pointer-events-none absolute bottom-1 top-1 rounded-full bg-ink shadow-[0_2px_8px_-2px_rgba(0,0,0,0.25)] transition-[left] duration-300 ease-out"
              :style="{
                width: 'calc(50% - 8px)',
                left: leagueB === 'AL' ? '4px' : 'calc(50% + 4px)',
              }"
            />
            <button
              type="button"
              class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors"
              :class="leagueB === 'AL' ? 'text-paper' : 'text-[#5a5a52]'"
              @click="leagueB = 'AL'"
            >
              美聯
            </button>
            <button
              type="button"
              class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors"
              :class="leagueB === 'NL' ? 'text-paper' : 'text-[#5a5a52]'"
              @click="leagueB = 'NL'"
            >
              國聯
            </button>
          </div>
          <div class="relative inline-flex h-8.5 w-full min-w-0 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3 md:w-[180px] md:flex-none">
            <select
              v-model="selectedTeamB"
              class="w-full min-w-0 max-w-full appearance-none truncate border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none"
            >
              <option :value="null" disabled>請選擇球隊</option>
              <option v-for="t in teamOptionsB" :key="t.id" :value="t.id">
                {{ TEAM_NAMES_TW[t.id] ?? t.name }}
              </option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
          <div class="relative inline-flex h-8.5 w-full min-w-0 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3 md:w-[180px] md:flex-none">
            <select
              v-model="selectedPlayerB"
              class="w-full min-w-0 max-w-full appearance-none truncate border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none"
            >
              <option :value="null" disabled>請選擇球員</option>
              <option v-for="r in rosterOptionsB" :key="r.person.id" :value="r.person.id">
                {{ r.person.fullName }}
              </option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
        </div>
      </div>

      <!-- Hero: player A | VS | player B -->
      <div class="relative mb-5 grid grid-cols-2 items-center gap-3 md:mb-7 md:grid-cols-[1fr_100px_1fr] md:gap-6">
        <!-- Player A -->
        <div class="flex flex-col items-center gap-2 text-center md:flex-row md:gap-5 md:text-left">
          <div class="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full md:h-22 md:w-22">
            <img
              v-if="playerA"
              :src="playerA.headshot"
              :alt="playerA.fullName"
              class="h-full w-full object-cover"
            />
            <svg
              v-else
              viewBox="0 0 64 64"
              class="h-full w-full bg-[#d8d6c8] text-[#a8a59a]"
            >
              <circle cx="32" cy="26" r="11" fill="currentColor" />
              <path
                fill="currentColor"
                d="M32 40c-11 0-20 7-20 16v8h40v-8c0-9-9-16-20-16z"
              />
            </svg>
          </div>
          <div class="min-w-0 md:whitespace-nowrap">
            <h3 class="text-sm font-bold leading-tight tracking-tight md:text-2xl">{{ playerA?.fullName ?? '-' }}</h3>
            <div v-if="playerAMeta" class="mt-1 font-mono text-[10px] tracking-wider text-muted md:text-[11px]">
              <span v-if="playerA">#{{ playerA.jerseyNumber }} · </span>{{ handLabel(playerAMeta.bats) }}打{{ handLabel(playerAMeta.throws) }}投 · {{ playerAMeta.height }}
            </div>
          </div>
        </div>

        <!-- VS -->
        <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center md:static md:translate-x-0 md:translate-y-0">
          <div class="rounded-full bg-white px-2 py-1 text-sm font-extrabold tracking-tighter opacity-90 shadow-sm md:bg-transparent md:p-0 md:text-4xl md:shadow-none">VS</div>
          <div class="mt-1 hidden font-mono text-[10px] tracking-[0.22em] text-muted md:block">SEASON {{ season }}</div>
        </div>

        <!-- Player B -->
        <div class="flex flex-col items-center gap-2 text-center md:flex-row-reverse md:gap-5 md:text-right">
          <div class="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full md:h-22 md:w-22">
            <img
              v-if="playerB"
              :src="playerB.headshot"
              :alt="playerB.fullName"
              class="h-full w-full object-cover"
            />
            <svg
              v-else
              viewBox="0 0 64 64"
              class="h-full w-full bg-[#d8d6c8] text-[#a8a59a]"
            >
              <circle cx="32" cy="26" r="11" fill="currentColor" />
              <path
                fill="currentColor"
                d="M32 40c-11 0-20 7-20 16v8h40v-8c0-9-9-16-20-16z"
              />
            </svg>
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-bold leading-tight tracking-tight md:text-2xl">{{ playerB?.fullName ?? '-' }}</h3>
            <div v-if="playerBMeta" class="mt-1 font-mono text-[10px] tracking-wider text-muted md:text-[11px]">
              <span v-if="playerB">#{{ playerB.jerseyNumber }} · </span>{{ handLabel(playerBMeta.bats) }}打{{ handLabel(playerBMeta.throws) }}投 · {{ playerBMeta.height }}
            </div>
          </div>
        </div>
      </div>

      <!-- Stats grid -->
      <div class="overflow-hidden rounded-xl border border-hairline bg-hairline">
        <div
          v-for="row in stats"
          :key="row.key"
          class="grid grid-cols-[1fr_70px_1fr] items-center bg-panel md:grid-cols-[1fr_140px_1fr]"
        >
          <!-- Player A value -->
          <div
            class="flex items-center justify-end gap-1.5 px-3 py-2.5 font-mono text-xl font-bold tabular-nums tracking-tight md:gap-2.5 md:px-6 md:py-4 md:text-3xl"
            :class="row.winner === 'A' ? 'text-grass' : 'text-[#c5c2b3]'"
          >
            {{ row.valueA }}
            <svg
              v-if="row.winner === 'A'"
              viewBox="0 0 64 64"
              class="h-3.5 w-3.5 flex-shrink-0 self-center md:h-4 md:w-4"
            >
              <circle cx="32" cy="32" r="30" class="fill-grass" />
              <path fill="#fff" d="m20 17.5l3.8 16.6l.8 4.6l.8-4.5l3.3-16.7h6.4l3.4 16.6l.9 4.6l.9-4.4l3.9-16.8h6.2l-8.2 29h-5.8l-3.5-17l-1-5.6l-1 5.6l-3.5 17h-5.6l-8.2-29z" />
            </svg>
          </div>

          <!-- Center label -->
          <div class="border-x border-hairline bg-white px-1.5 py-2.5 text-center font-mono md:px-2 md:py-3.5">
            <div class="text-[9px] tracking-[0.22em] text-[#7a7a70] md:text-[10px]">{{ row.labelEn }}</div>
            <div class="mt-0.5 font-sans text-[10px] font-medium text-[#3a3a35] md:text-[11px]">{{ row.labelTw }}</div>
          </div>

          <!-- Player B value -->
          <div
            class="flex items-center justify-start gap-1.5 px-3 py-2.5 font-mono text-xl font-bold tabular-nums tracking-tight md:gap-2.5 md:px-6 md:py-4 md:text-3xl"
            :class="row.winner === 'B' ? 'text-grass' : 'text-[#c5c2b3]'"
          >
            {{ row.valueB }}
            <svg
              v-if="row.winner === 'B'"
              viewBox="0 0 64 64"
              class="h-3.5 w-3.5 flex-shrink-0 self-center md:h-4 md:w-4"
            >
              <circle cx="32" cy="32" r="30" class="fill-grass" />
              <path fill="#fff" d="m20 17.5l3.8 16.6l.8 4.6l.8-4.5l3.3-16.7h6.4l3.4 16.6l.9 4.6l.9-4.4l3.9-16.8h6.2l-8.2 29h-5.8l-3.5-17l-1-5.6l-1 5.6l-3.5 17h-5.6l-8.2-29z" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
