<script setup lang="ts">
import ScoreboardLayout from '@/components/player-compare/layouts/ScoreboardLayout.vue'

// 全部靜態：mode / layout 切換的 active 狀態先寫死
type Mode = 'batting' | 'pitching'
type Layout = 'v1' | 'v2' | 'v3'
const mode = 'batting' as Mode
const layout = 'v1' as Layout

const playerA = { fullName: '大谷 翔平', team: 'LAD', number: 17, accent: 'grass' as const }
const playerB = { fullName: 'Aaron Judge', team: 'NYY', number: 99, accent: 'dirt' as const }
const season = '2025'
</script>

<template>
  <div class="min-h-screen bg-paper font-sans text-ink">
    <!-- Control Bar -->
    <header class="sticky top-0 z-10 border-b border-[#d8d6c8] bg-white px-5 py-3.5 md:px-6 md:py-4">
      <!-- Top row: brand + mode toggle + layout toggle -->
      <div class="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <!-- Brand -->
        <div class="flex items-center gap-2.5">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-grass to-dirt font-mono text-[13px] font-bold text-white md:h-7 md:w-7">
            ⚾
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-[15px] font-bold tracking-tight text-ink">球員數據對戰</span>
            <span class="font-mono text-[10px] tracking-[0.18em] text-[#7a7a70]">PLAYER COMPARE</span>
          </div>
        </div>

        <!-- Mode toggle -->
        <div class="relative inline-flex rounded-full border border-[#d8d6c8] bg-[#f4f3ec] p-1">
          <span
            class="absolute bottom-1 top-1 left-1 rounded-full bg-ink shadow-[0_2px_8px_-2px_rgba(0,0,0,0.25)] transition-[left] duration-300 ease-out"
            :style="{ width: 'calc(50% - 4px)', left: mode === 'batting' ? '4px' : 'calc(50% + 0px)' }"
          />
          <button
            type="button"
            class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-4 py-2 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors md:px-5"
            :class="mode === 'batting' ? 'text-paper' : 'text-[#5a5a52]'"
          >
            打者 BATTING
          </button>
          <button
            type="button"
            class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-4 py-2 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors md:px-5"
            :class="mode === 'pitching' ? 'text-paper' : 'text-[#5a5a52]'"
          >
            投手 PITCHING
          </button>
        </div>

        <!-- Layout toggle -->
        <div class="relative inline-flex rounded-full border border-[#d8d6c8] bg-[#f4f3ec] p-1">
          <span
            class="absolute bottom-1 top-1 left-1 rounded-full bg-ink shadow-[0_2px_8px_-2px_rgba(0,0,0,0.25)] transition-[left] duration-300 ease-out"
            :style="{
              width: 'calc(33.333% - 3px)',
              left: layout === 'v1' ? '4px' : layout === 'v2' ? 'calc(33.333% + 1px)' : 'calc(66.666% + 0px)',
            }"
          />
          <button
            type="button"
            class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-3 py-2 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors md:px-4"
            :class="layout === 'v1' ? 'text-paper' : 'text-[#5a5a52]'"
          >
            01 · 記分板
          </button>
          <button
            type="button"
            class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-3 py-2 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors md:px-4"
            :class="layout === 'v2' ? 'text-paper' : 'text-[#5a5a52]'"
          >
            02 · 卡片
          </button>
          <button
            type="button"
            class="relative z-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-3 py-2 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors md:px-4"
            :class="layout === 'v3' ? 'text-paper' : 'text-[#5a5a52]'"
          >
            03 · 球場
          </button>
        </div>
      </div>

      <!-- Bottom row: Player A | YEAR | Player B -->
      <div class="mt-3 grid grid-cols-1 items-center gap-3 border-t border-dashed border-[#ebe9dd] pt-3 md:grid-cols-[1fr_auto_1fr] md:gap-3.5">
        <!-- Player A controls -->
        <div class="flex flex-wrap items-center justify-start gap-2">
          <span class="font-mono text-[10px] tracking-[0.18em] text-muted">A</span>

          <!-- League select -->
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3">
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>全部</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>

          <!-- Team select -->
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] pl-2 pr-3">
            <span class="mr-2 rounded bg-ink px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-wider text-paper">
              ALL
            </span>
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>全部球隊</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>

          <!-- Player select -->
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] pl-3 pr-3">
            <span class="mr-2 inline-block h-2 w-2 rounded-full bg-grass" />
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>{{ playerA.fullName }} · {{ playerA.team }} · #{{ playerA.number }}</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
        </div>

        <!-- Year (center) -->
        <div class="flex items-center justify-center gap-2 px-2 md:border-x md:border-[#ebe9dd]">
          <span class="font-mono text-[10px] tracking-[0.18em] text-muted">YEAR</span>
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3">
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>{{ season }} 賽季</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>
        </div>

        <!-- Player B controls -->
        <div class="flex flex-wrap items-center justify-end gap-2">
          <!-- Player select -->
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] pl-3 pr-3">
            <span class="mr-2 inline-block h-2 w-2 rounded-full bg-dirt" />
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>{{ playerB.fullName }} · {{ playerB.team }} · #{{ playerB.number }}</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>

          <!-- Team select -->
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] pl-2 pr-3">
            <span class="mr-2 rounded bg-ink px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-wider text-paper">
              ALL
            </span>
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>全部球隊</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>

          <!-- League select -->
          <div class="relative inline-flex h-8.5 items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3">
            <select class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none">
              <option>全部</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
          </div>

          <span class="font-mono text-[10px] tracking-[0.18em] text-muted">B</span>
        </div>
      </div>
    </header>

    <!-- Scoreboard layout -->
    <ScoreboardLayout />
  </div>
</template>
