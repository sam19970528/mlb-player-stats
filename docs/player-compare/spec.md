# Player Compare — 規格

## 功能概述

兩位 MLB 球員並列比較數據的工具。支援打者 / 投手雙模式、跨年份切換、台灣球迷視角中文化（球隊名、聯盟名）。

- mode 綁路由：`/batting`、`/pitching`
- season、兩側球員選擇記錄到 localStorage（依 mode 分別存）
- 預設體驗（首次進站）：
  - 打者：Aaron Judge（美聯／紐約洋基） vs Shohei Ohtani（國聯／洛杉磯道奇）
  - 投手：Tarik Skubal（美聯／底特律老虎） vs Paul Skenes（國聯／匹茲堡海盜）
  - 年份：當前年（`new Date().getFullYear()`）

## 路由

| Path | 對應 mode |
|---|---|
| `/` | redirect 到 `/batting` |
| `/batting` | 打者 |
| `/pitching` | 投手 |

route.meta.mode 決定 store.mode。URL 是 mode 的 source of truth；切按鈕會 `router.push`。

## 狀態管理

Pinia + pinia-plugin-persistedstate。

### Store 結構

```ts
{
  mode: 'batting' | 'pitching'         // 不 persist（由 URL 控）
  season: number                        // persist
  batting: ModeSelection                // persist
  pitching: ModeSelection               // persist
}

ModeSelection = {
  leagueA / leagueB: 'AL' | 'NL'
  teamA / teamB: number | null
  playerA / playerB: number | null
}
```

打者與投手的選擇互相隔離；切 mode 時讀對應 mode 的選擇。

### 種子球員

| Mode | A 側 | B 側 |
|---|---|---|
| 打者 | 美聯 / NYY (147) / Aaron Judge (592450) | 國聯 / LAD (119) / Shohei Ohtani (660271) |
| 投手 | 美聯 / DET (116) / Tarik Skubal (669373) | 國聯 / PIT (134) / Paul Skenes (694973) |

僅當「該 mode 的 localStorage 為空」才套用種子。使用者主動清空（例如年份切到無資料、球員下拉清空）後，重整不會被種子覆蓋。

## 使用者流程

### 載入

1. router 解析 mode（URL）
2. store 還原 season 與兩 mode 的選擇（localStorage）
3. ScoreboardLayout onMounted：
   - 抓 teams（依 season）
   - 從 store 還原當前 mode 的選擇到本地 ref
   - 該 mode 完全空 → 套種子
   - 依當前 selection 跑載入流程：roster → 過濾不在 roster 的球員 → stats + person

### 操作

| 行為 | 處理 |
|---|---|
| 切 mode（batting ↔ pitching） | router.push → store.mode 變 → persist 舊 mode 的 ref → hydrate 新 mode → 若空套種子 → load |
| 切 league（AL ↔ NL） | 該側球隊清空 |
| 切球隊 | 該側球員清空、roster 重抓 |
| 切球員 | 該側 stats、person、頭像 loaded 狀態重抓／重置 |
| 切年份 | 兩側 roster 重抓 → 原球員不在新 roster 則清空 → stats 重抓 |
| 任一選擇值變動 | 自動 persist 寫回 store 對應 mode |

### 配對規則

- 跨聯盟、跨球隊、同人都允許
- 打者只能在打者池選；投手只能在投手池選（依 `position.abbreviation`，TWP 兩邊都會出現）

## UI 結構

目前只實作「記分板」一個版型（其他版型暫隱藏，留待後續）。

### 控制列

| 項目 | UI |
|---|---|
| Mode 切換 | 膠囊按鈕（打者 BATTING / 投手 PITCHING），全頁共用 |
| 年份 | 下拉選單，桌機在記分板中央、手機在 mode 切換下方 |
| Layout 切換 | 暫隱藏（`v-if="false"`） |
| 聯盟 | 膠囊按鈕（美聯 / 國聯），A 側左、B 側右 |
| 球隊 | 下拉選單，初始顯示「請選擇球隊」（disabled），選項用中文全名 |
| 球員 | 下拉選單，初始顯示「請選擇球員」（disabled），跟著 mode 過濾（純投手 / 野手 + TWP） |

### Hero 區

- 桌機：頭像 + 名字 + meta 三欄排列（A | VS | B）
- 手機：A 與 B 各自垂直堆疊置中，左右各佔一欄

頭像：
- 載入中 → skeleton（米色圓 + animate-pulse）
- 載入完 → MLB silo 透明背景圖
- 沒選球員 → 空頭像 SVG（FB 風格灰人形）

Meta 行：背號 · 左／右打投 · 身高（公分）。沒選球員時整行隱藏。

### Stats 區

依 mode 顯示不同欄位、勝者標 grass 色 W 圖示。沒選球員或無資料 → 顯示 `-`。

**打者 (11 項)**：AVG、H、HR、RBI、R、SB、OBP、BB、OPS、SLG、SO（SO 越低越好）

**投手 (14 項)**：G、GS、W、L、IP、ERA、WHIP、OBA、HLD、SV、K、BB、HR、H（ERA、WHIP、OBA、L、BB、HR、H 越低越好）

## 邊界 / 例外

| 情境 | 處理方式 |
|---|---|
| 球員某年沒上場 / 數據缺失 | 該欄位顯示 `-` |
| Headshot 載入中 | Skeleton（米色 + animate-pulse） |
| 球員不在當前 season 的 roster | 球員清空、頭像空頭像、meta 隱藏、stats 全 `-` |
| API 失敗 | `console.error`、畫面維持空白 |

## 資料層

詳細 endpoint 與欄位見 `./api.md`。重點：

- Roster 用 `rosterType=40Man`（含 IL，傷兵期間也找得到）
- Headshot 用 `headshot/silo`（透明背景）
- 球員身高來自 `/people/{id}`，原始為英制（`6' 4"`），前端解析轉公分
- 球隊中文 mapping 在 `src/constants/mlb-teams.ts`（id → 中文全名）

## 共用元件

`YearSelect`（`src/components/player-compare/common/YearSelect.vue`）
- `v-model` 接 `number`
- 選項 1876 ~ 當前年，由新到舊

## 暫不做（後續再加）

- v2 卡片版型、v3 球場版型
- 深淺色主題
- A、B 兩側獨立年份（跨年份比較）
- 生涯累計統計
- 球員搜尋（自動完成）
- API 失敗的 UI 表現（目前只 console.error）

## 相關文件

- API 串接細節：`./api.md`
