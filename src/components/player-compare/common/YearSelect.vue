<script setup lang="ts">
const YEAR_MIN = 1876
const YEAR_MAX = new Date().getFullYear()
const years = Array.from(
  { length: YEAR_MAX - YEAR_MIN + 1 },
  (_, i) => YEAR_MAX - i,
)

const model = defineModel<number>({ required: true })
</script>

<template>
  <div class="relative inline-flex h-8.5 w-fit items-center rounded-lg border border-[#d8d6c8] bg-[#f4f3ec] px-3">
    <select
      v-model="model"
      class="appearance-none border-0 bg-transparent pr-5 font-sans text-[13px] font-semibold text-ink outline-none"
    >
      <option v-for="year in years" :key="year" :value="year">
        {{ year }} 賽季
      </option>
    </select>
    <span class="pointer-events-none absolute right-2.5 text-[10px] text-[#7a7a70]">▼</span>
  </div>
</template>
