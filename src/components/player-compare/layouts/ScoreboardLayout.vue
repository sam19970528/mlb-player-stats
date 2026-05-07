<script setup lang="ts">
const playerA = {
  initials: 'SO',
  number: 17,
  fullName: '大谷 翔平',
  romaji: 'OHTANI',
  bats: 'L',
  throws: 'R',
  height: '193cm',
  accent: 'grass',
}

const playerB = {
  initials: 'AJ',
  number: 99,
  fullName: 'Aaron Judge',
  romaji: 'JUDGE',
  bats: 'R',
  throws: 'R',
  height: '201cm',
  accent: 'dirt',
}

const season = '2025'

type League = 'AL' | 'NL'
const leagueA = 'AL' as League
const leagueB = 'AL' as League

const handLabel = (hand: string) => (hand === 'L' ? '左' : '右')

const stats = [
  { labelEn: 'AVG', labelTw: '打擊率', valueA: '.298', valueB: '.305', winner: 'B' },
  { labelEn: 'H', labelTw: '安打', valueA: '178', valueB: '165', winner: 'A' },
  { labelEn: 'HR', labelTw: '全壘打', valueA: '51', valueB: '48', winner: 'A' },
  { labelEn: 'BB', labelTw: '四壞球', valueA: '95', valueB: '121', winner: 'B' },
  { labelEn: 'OPS', labelTw: 'OPS', valueA: '1.012', valueB: '1.084', winner: 'B' },
] as const
</script>

<template>
  <section class="bg-paper p-4 font-sans text-ink md:px-12 md:py-10">
    <!-- Scoreboard card -->
    <div class="relative overflow-hidden rounded-2xl border border-hairline bg-white p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.12)] md:p-9">
      <!-- decorative gradient grain -->
      <div
        class="pointer-events-none absolute inset-0"
        :style="{
          backgroundImage:
            'radial-gradient(circle at 18% 0%, oklch(0.6 0.13 145 / 0.07), transparent 45%), radial-gradient(circle at 82% 100%, oklch(0.6 0.12 50 / 0.06), transparent 45%)',
        }"
      />

      <!-- Selectors row — aligned with hero columns -->
      <div class="relative mb-5 grid grid-cols-[1fr_50px_1fr] items-center gap-2 md:grid-cols-[1fr_100px_1fr] md:gap-6">
        <!-- Player A selectors -->
        <div class="flex flex-wrap items-center justify-start gap-2">
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
            >
              AL
            </button>
            <button
              type="button"
              class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors"
              :class="leagueA === 'NL' ? 'text-paper' : 'text-[#5a5a52]'"
            >
              NL
            </button>
          </div>
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3">
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>全部球隊</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3">
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>{{ playerA.fullName }}</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
        </div>

        <!-- Year (center, aligned with VS) -->
        <div class="flex items-center justify-center">
          <div class="relative inline-flex h-8.5 w-fit items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3">
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>{{ season }} 賽季</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
        </div>

        <!-- Player B selectors -->
        <div class="flex flex-wrap items-center justify-end gap-2">
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
            >
              AL
            </button>
            <button
              type="button"
              class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors"
              :class="leagueB === 'NL' ? 'text-paper' : 'text-[#5a5a52]'"
            >
              NL
            </button>
          </div>
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3">
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>全部球隊</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3">
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>{{ playerB.fullName }}</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
        </div>
      </div>

      <!-- Hero: player A | VS | player B -->
      <div class="relative mb-5 grid grid-cols-[1fr_50px_1fr] items-center gap-2 md:mb-7 md:grid-cols-[1fr_100px_1fr] md:gap-6">
        <!-- Player A -->
        <div class="flex items-center gap-3 md:gap-5">
          <div class="relative h-12 w-12 flex-shrink-0 rounded-full bg-grass shadow-[inset_0_-6px_0_rgba(0,0,0,0.18)] flex items-center justify-center font-mono text-base font-bold text-white md:h-22 md:w-22 md:text-3xl">
            {{ playerA.initials }}
            <span class="absolute -bottom-1.5 -right-1.5 rounded border-2 border-white bg-ink px-1 py-0.5 font-mono text-[9px] text-paper md:-bottom-2 md:-right-2 md:px-1.5 md:text-[11px]">
              #{{ playerA.number }}
            </span>
          </div>
          <div class="min-w-0 whitespace-nowrap">
            <h3 class="text-sm font-bold leading-tight tracking-tight md:text-2xl">{{ playerA.fullName }}</h3>
            <div class="mt-1 font-mono text-[10px] tracking-wider text-muted md:text-[11px]">
              {{ handLabel(playerA.bats) }}打{{ handLabel(playerA.throws) }}投 · {{ playerA.height }}
            </div>
          </div>
        </div>

        <!-- VS -->
        <div class="text-center">
          <div class="text-lg font-extrabold tracking-tighter opacity-85 md:text-4xl">VS</div>
          <div class="mt-0.5 font-mono text-[9px] tracking-[0.22em] text-muted md:mt-1 md:text-[10px]">SEASON {{ season }}</div>
        </div>

        <!-- Player B -->
        <div class="flex flex-row-reverse items-center gap-2 text-right md:gap-5">
          <div class="relative h-12 w-12 flex-shrink-0 rounded-full bg-dirt shadow-[inset_0_-6px_0_rgba(0,0,0,0.18)] flex items-center justify-center font-mono text-base font-bold text-white md:h-22 md:w-22 md:text-3xl">
            {{ playerB.initials }}
            <span class="absolute -bottom-1.5 -right-1.5 rounded border-2 border-white bg-ink px-1 py-0.5 font-mono text-[9px] text-paper md:-bottom-2 md:-right-2 md:px-1.5 md:text-[11px]">
              #{{ playerB.number }}
            </span>
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-bold leading-tight tracking-tight md:text-2xl">{{ playerB.fullName }}</h3>
            <div class="mt-1 font-mono text-[10px] tracking-wider text-muted md:text-[11px]">
              {{ handLabel(playerB.bats) }}打{{ handLabel(playerB.throws) }}投 · {{ playerB.height }}
            </div>
          </div>
        </div>
      </div>

      <!-- Stats grid -->
      <div class="overflow-hidden rounded-xl border border-hairline bg-hairline">
        <div
          v-for="row in stats"
          :key="row.labelEn"
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
