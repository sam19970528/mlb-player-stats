# MLB Player Stats — 開發準則

## 命名規範

- 元件檔案：PascalCase（`PlayerSelect.vue`）
- composable：camelCase + `use` 前綴（`useCompareState.ts`）
- type：PascalCase（`Player`、`StatMeta`）
- 常數：UPPER_SNAKE_CASE（`STAT_KEYS`）

## Commit 規範

- 格式：`prefix: 中文簡短描述`
- prefix：`feat` / `fix` / `refactor` / `style` / `docs` / `chore` / `test`
- 單行標題，不寫 description
- 不寫 Co-Authored-By
- 範例：
  - `feat: 加入球員下拉選單`
  - `fix: 修正年份切換時球員資料沒更新`
  - `refactor: 拆出 useCompareState composable`

## Vue 開發規則

- 一律用 `<script setup lang="ts">`
- 樣式優先用 UnoCSS class，避免大量 `<style>` 區塊

## 資料層

（待補：MLB 資料來源、fetch 方式、型別定義）

## 開發原則

- **YAGNI**：只實作當前需要的功能，不為「可能的需求」預先做準備
- **修改範圍要明確**：不擅自擴張需求，不順便重構無關的程式
- **推不出來就先問**：欄位名稱、API 路徑、業務邏輯無法從程式碼推斷時，停下來問

## 不做的事

- 不主動 `commit` / `push`（等使用者明確指令）
- 不主動 `git add -A`，避免誤加敏感檔案
- 不改與當前任務無關的程式碼
- 不加入未來才需要的抽象層
- 不在 commit 訊息加 Co-Authored-By
- **本專案 commit 前不跑 prettier**（覆蓋全域規則）
