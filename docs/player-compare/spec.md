# Player Compare — 規格

## 功能概述

兩位 MLB 球員並列比較數據的工具。支援打者 / 投手雙模式、跨年份比較、三種 UI 版型切換、深淺色主題，所有操作即時記錄到 localStorage。

預設體驗：
- 打者模式：大谷 翔平 vs Aaron Judge
- 投手模式：Tarik Skubal vs Paul Skenes
- 預設年份：2026
- 預設版型：v1 記分板
- 預設主題：淺色

## 使用者流程

### 首次進站
1. 偵測 localStorage 是否有狀態
2. 無 → 寫入完整預設 state（mode / 球員 A / 球員 B / 年份 A / 年份 B / 版型 / 主題 / 兩邊各自的聯盟 + 球隊）
3. 有 → 讀取後 restore

### 操作
- 任何狀態變動 → 立即寫回 localStorage
- 切換 mode（打者 ↔ 投手）→ 球員池整個換、預設值用該 mode 的預設
- 切換聯盟 → 該側的球隊重置為「全部」
- 切換球隊 → 該側的球員下拉重新打 roster API
- 切換年份 → 重打 stats API
- 切換版型 / 主題 → 純 UI，不打 API

### 跨年份比較
A、B 兩側各自有獨立的年份下拉（例：A=2025 大谷 vs B=2023 Judge）。

## UI 版型

設計參考：handoff bundle 內的 `mlb/project/MLB Player Compare.html` 與三個變體 jsx。

| 版型 | 名稱 | 視覺重點 |
|---|---|---|
| v1 | Stadium Scoreboard | 列表對沖、等寬大數字、中央標籤 |
| v2 | Side-by-Side Cards | 雙球員卡片、長條圖左右對沖 |
| v3 | Diamond Dashboard | 棒球場視角、雷達圖中心、四角資訊卡 |

三種版型都要做手機版，邊做邊調整。

## 控制列

| 項目 | UI 樣式 |
|---|---|
| 投打 mode | 待定 |
| 聯盟（AL / NL） | 膠囊按鈕 + active 樣式 |
| 球隊 | 下拉選單 |
| 球員 | 下拉選單 |
| 年份 | 下拉選單（左右各一） |
| 版型切換 | 待定（設計稿是膠囊按鈕） |
| 主題切換 | 待定 |

## 狀態管理

使用 **Pinia + pinia-plugin-persistedstate**，state 自動同步到 localStorage，不用手動 watch。

### State 欄位

```
mode             # 'batting' | 'pitching'
layout           # 'v1' | 'v2' | 'v3'
theme            # 'light' | 'dark'
playerA / playerB
yearA / yearB
leagueA / leagueB    # 'AL' | 'NL' | 'ALL'
teamA / teamB        # team id 或 'ALL'
```

mode 切換時要分別保留打者狀態跟投手狀態（避免從投手切回打者後 reset）。

localStorage key 命名：待定。

### 預設值

| Key | 打者預設 | 投手預設 |
|---|---|---|
| playerA | Shohei Ohtani | Tarik Skubal |
| playerB | Aaron Judge | Paul Skenes |
| yearA / yearB | 2026 / 2026 | 2026 / 2026 |
| leagueA / leagueB | ALL / ALL | ALL / ALL |
| teamA / teamB | ALL / ALL | ALL / ALL |

共用：layout = `v1`、theme = `light`

## 配對規則

- 跨聯盟、跨球隊、同隊、同人都不擋（先放寬）
- 打者只能跟打者比、投手只能跟投手比

## 邊界 / 例外

| 情境 | 處理方式 |
|---|---|
| 球員某年沒上場 / 沒資料 | 該欄位顯示 `—` |
| API 載入中 | Skeleton（不要轉圈） |
| API 失敗 | 待定 |
| 球員無 headshot | Fallback 到首字母圓形徽章（設計稿原本的樣式） |
| 球員資料部分欄位缺失 | 該欄位顯示 `—`，不擋整體比較 |

## 暫不做（v1 不在範圍）

- 生涯累計統計
- 球員搜尋（自動完成）
- i18n / 中英切換
- 折線圖（年度趨勢）
- 球員照片授權處理（先用 MLB 提供的 headshot URL）

## 待定項目（總表）

- 投打 mode 的 UI 樣式
- 版型切換按鈕的位置與樣式
- 主題切換按鈕的位置與樣式
- localStorage key 命名規則
- API 失敗時的 UI 表現
- 球員下拉的排序方式（背號 / 名字 / 球隊）
- mode 切換是否動畫過渡
- 年份下拉是否要限制在球員出道後（目前決定：不限制）

## 相關文件

- API 串接細節：`./api.md`
- 設計參考：handoff bundle（已收入 `/tmp/mlb-design/`，未進 git）
