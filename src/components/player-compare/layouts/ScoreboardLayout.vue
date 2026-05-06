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

const stats = [
  { labelEn: 'AVG', labelTw: '打擊率', valueA: '.298', valueB: '.305', winner: 'B' },
  { labelEn: 'H', labelTw: '安打', valueA: '178', valueB: '165', winner: 'A' },
  { labelEn: 'HR', labelTw: '全壘打', valueA: '51', valueB: '48', winner: 'A' },
  { labelEn: 'BB', labelTw: '四壞球', valueA: '95', valueB: '121', winner: 'B' },
  { labelEn: 'OPS', labelTw: 'OPS', valueA: '1.012', valueB: '1.084', winner: 'B' },
] as const
</script>

<template>
  <section class="bg-paper p-9 font-sans text-ink md:p-10">
    <!-- Topbar -->
    <header class="mb-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-grass to-dirt font-mono text-sm font-bold text-white"
        >
          ⚾
        </div>
        <span class="font-mono text-[11px] tracking-[0.22em] text-[#5a5a52]">
          FRONTEND PORTFOLIO · COMPARE 01
        </span>
      </div>
      <div class="hidden gap-2 md:flex">
        <span class="rounded-full border border-ink bg-ink px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] text-paper">
          {{ season }}
        </span>
        <span class="rounded-full border border-[#d6d3c5] px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] text-[#5a5a52]">
          BATTING
        </span>
        <span class="rounded-full border border-[#d6d3c5] px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] text-[#5a5a52]">
          {{ stats.length }} CATEGORIES
        </span>
      </div>
    </header>

    <h2 class="mt-3 text-3xl font-bold tracking-tight">
      球員數據對決
      <span class="ml-2 text-xl font-normal text-muted">
        Player Head-to-Head · {{ season }}
      </span>
    </h2>

    <!-- Scoreboard card -->
    <div class="relative mt-5 overflow-hidden rounded-2xl border border-hairline bg-white p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.12)] md:p-9">
      <!-- decorative gradient grain -->
      <div
        class="pointer-events-none absolute inset-0"
        :style="{
          backgroundImage:
            'radial-gradient(circle at 18% 0%, oklch(0.6 0.13 145 / 0.07), transparent 45%), radial-gradient(circle at 82% 100%, oklch(0.6 0.12 50 / 0.06), transparent 45%)',
        }"
      />

      <!-- Hero: player A | VS | player B -->
      <div class="relative mb-7 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_100px_1fr]">
        <!-- Player A -->
        <div class="flex items-center gap-5 md:flex-row">
          <div class="relative h-22 w-22 flex-shrink-0 rounded-full bg-grass shadow-[inset_0_-6px_0_rgba(0,0,0,0.18)] flex items-center justify-center font-mono text-3xl font-bold text-white">
            {{ playerA.initials }}
            <span class="absolute -bottom-2 -right-2 rounded border-2 border-white bg-ink px-1.5 py-0.5 font-mono text-[11px] text-paper">
              #{{ playerA.number }}
            </span>
          </div>
          <div>
            <h3 class="text-2xl font-bold leading-tight tracking-tight">{{ playerA.fullName }}</h3>
            <div class="mt-1 font-mono text-xs tracking-[0.18em] text-[#7a7a70]">{{ playerA.romaji }}</div>
            <div class="mt-2 font-mono text-[11px] tracking-wider text-muted">
              B/T {{ playerA.bats }}/{{ playerA.throws }} · {{ playerA.height }}
            </div>
          </div>
        </div>

        <!-- VS -->
        <div class="text-center">
          <div class="text-3xl font-extrabold tracking-tighter opacity-85 md:text-4xl">VS</div>
          <div class="mt-1 font-mono text-[10px] tracking-[0.22em] text-muted">SEASON {{ season }}</div>
        </div>

        <!-- Player B -->
        <div class="flex items-center gap-5 md:flex-row-reverse md:text-right">
          <div class="relative h-22 w-22 flex-shrink-0 rounded-full bg-dirt shadow-[inset_0_-6px_0_rgba(0,0,0,0.18)] flex items-center justify-center font-mono text-3xl font-bold text-white">
            {{ playerB.initials }}
            <span class="absolute -bottom-2 -right-2 rounded border-2 border-white bg-ink px-1.5 py-0.5 font-mono text-[11px] text-paper">
              #{{ playerB.number }}
            </span>
          </div>
          <div>
            <h3 class="text-2xl font-bold leading-tight tracking-tight">{{ playerB.fullName }}</h3>
            <div class="mt-1 font-mono text-xs tracking-[0.18em] text-[#7a7a70]">{{ playerB.romaji }}</div>
            <div class="mt-2 font-mono text-[11px] tracking-wider text-muted">
              B/T {{ playerB.bats }}/{{ playerB.throws }} · {{ playerB.height }}
            </div>
          </div>
        </div>
      </div>

      <!-- Stats grid -->
      <div class="overflow-hidden rounded-xl border border-hairline bg-hairline">
        <div
          v-for="row in stats"
          :key="row.labelEn"
          class="grid grid-cols-[1fr_90px_1fr] items-center bg-panel md:grid-cols-[1fr_140px_1fr]"
        >
          <!-- Player A value -->
          <div
            class="flex items-center justify-end gap-2.5 px-4 py-4 font-mono text-2xl font-bold tabular-nums tracking-tight md:px-6 md:text-3xl"
            :class="row.winner === 'A' ? 'text-grass' : 'text-[#c5c2b3]'"
          >
            {{ row.valueA }}
            <span
              v-if="row.winner === 'A'"
              class="inline-block h-1.5 w-1.5 rounded-full bg-[oklch(0.6_0.18_145)] shadow-[0_0_0_3px_oklch(0.6_0.18_145/0.18)]"
            />
          </div>

          <!-- Center label -->
          <div class="border-x border-hairline bg-white px-2 py-3.5 text-center font-mono">
            <div class="text-[10px] tracking-[0.22em] text-[#7a7a70]">{{ row.labelEn }}</div>
            <div class="mt-0.5 font-sans text-[11px] font-medium text-[#3a3a35]">{{ row.labelTw }}</div>
          </div>

          <!-- Player B value -->
          <div
            class="flex items-center justify-start gap-2.5 px-4 py-4 font-mono text-2xl font-bold tabular-nums tracking-tight md:px-6 md:text-3xl"
            :class="row.winner === 'B' ? 'text-dirt' : 'text-[#c5c2b3]'"
          >
            <span
              v-if="row.winner === 'B'"
              class="inline-block h-1.5 w-1.5 rounded-full bg-[oklch(0.6_0.18_145)] shadow-[0_0_0_3px_oklch(0.6_0.18_145/0.18)]"
            />
            {{ row.valueB }}
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-4 flex items-center justify-between pt-3 font-mono text-[10px] tracking-[0.18em] text-muted">
        <span>· DEMO DATA · NOT REAL STATS</span>
        <span>{{ stats.length }} CATEGORIES · UPDATED {{ season }}</span>
      </div>
    </div>
  </section>
</template>
