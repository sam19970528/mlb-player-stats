# Scoreboard 預設賽季載入設計

## 範圍

進入頁面後依「當前年」載入 teams 與兩側 roster，預選種子球隊與球員（大谷 vs Judge），並把球員名字、背號、頭像換成 API 來的。stats 維持寫死，留待後續。

## 資料流（onMounted）

```
1. fetchTeams(當前年)
   → 依 league.name 切成 AL / NL 兩份

2. teams 回來後，並行打：
   - fetchRoster(119, 當前年)   // LAD
   - fetchRoster(147, 當前年)   // NYY

3. roster 回來後：
   - A 球隊下拉 options = LAD 所屬 NL 球隊清單，預選 LAD
   - B 球隊下拉 options = NYY 所屬 AL 球隊清單，預選 NYY
   - A 球員下拉 options = LAD roster，預選 660271 (Ohtani)
   - B 球員下拉 options = NYY roster，預選 592450 (Judge)
   - A、B 上方顯示的名字、背號、頭像，從 roster 對應到的 person 取
```

- 不處理 loading 狀態（下拉在資料未到時 options 為空）
- API 失敗 → `console.error`，畫面維持空白

## 檔案異動

### 新增 `src/constants/player-compare.ts`

```ts
export const DEFAULT_BATTING_PAIR = {
  a: { teamId: 119, playerId: 660271 },  // LAD / Ohtani
  b: { teamId: 147, playerId: 592450 },  // NYY / Judge
} as const
```

### 修改 `src/components/player-compare/layouts/ScoreboardLayout.vue`

**setup 新增 ref：**
- `teams`：原始 teams 陣列
- `rosterA` / `rosterB`：兩側 roster 陣列
- `leagueA` / `leagueB`：'AL' | 'NL'，A 初始 `'NL'`（LAD），B 初始 `'AL'`（NYY）
- `selectedTeamA` / `selectedTeamB`：number | null
- `selectedPlayerA` / `selectedPlayerB`：number | null

**setup 新增 computed：**
- `teamOptionsA` / `teamOptionsB`：依 league 過濾 teams
- `playerA` / `playerB`：從 rosterA/rosterB 找出 selectedPlayerA/B 對應的 person，回傳 `{ fullName, jerseyNumber, headshotUrl }`

**onMounted：**
1. 打 `fetchTeams(當前年)`
2. 並行打兩側 `fetchRoster`
3. 設定 `selectedTeamA/B` 與 `selectedPlayerA/B` 為種子值

**模板：**
- 上方 hero 區的球員名字、背號從 computed `playerA` / `playerB` 取
- 圓形 initials 圓圈換成 `<img>`，src = headshot URL
- 球隊下拉、球員下拉的 options 與 v-model 接到上面的 ref
- 左/右打、身高、stats 區塊先維持寫死（不在本次範圍）

## 頭像 URL

```
https://img.mlbstatic.com/mlb-photos/image/upload/w_213,q_auto:best/v1/people/{playerId}/headshot/67/current.png
```
