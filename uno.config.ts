import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  theme: {
    fontFamily: {
      sans: '"Manrope", system-ui, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
    },
    colors: {
      // 球員主色
      grass: 'oklch(0.55 0.13 145)',     // 草綠（playerA accent）
      grassSoft: 'oklch(0.92 0.05 145)', // 淺草綠
      dirt: 'oklch(0.55 0.12 50)',       // 泥土（playerB accent）
      dirtSoft: 'oklch(0.92 0.05 50)',   // 淺泥土

      // 介面底色 / 邊線
      paper: '#f4f3ec',     // 主背景米色
      ink: '#14140f',       // 主要文字
      muted: '#9a9a90',     // 次要文字
      hairline: '#e5e3d5',  // 細線
      panel: '#fafaf3',     // 卡片內格底

      // 深色模式
      darkBg: '#14181a',
      darkPanel: '#1c2123',
      darkBorder: '#2c3134',
      darkText: '#ebede5',
      darkMuted: '#8a8e85',
    },
  },
})
