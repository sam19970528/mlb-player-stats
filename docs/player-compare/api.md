# Player Compare — API 串接

## 資料來源

**MLB Stats API** — `https://statsapi.mlb.com/api/v1/`

- 完全免 key、無需註冊
- CORS 全開（`Access-Control-Allow-Origin: *`），瀏覽器可直接 fetch，不用 proxy
- 球員照片 CDN 同樣 CORS 開放

## Endpoints

### 1. 取得所有球隊（含聯盟、分區）

```
GET /api/v1/teams?sportId=1&season={year}
```

`sportId=1` 代表 MLB（其他是小聯盟 / 國際賽）。

回傳結構：
```jsonc
{
  "teams": [
    {
      "id": 119,
      "name": "Los Angeles Dodgers",
      "abbreviation": "LAD",
      "league": { "id": 104, "name": "National League" },
      "division": { "id": 203, "name": "National League West" }
    }
  ]
}
```

辨識聯盟用 `league.name`：`American League` / `National League`。

### 2. 取得球隊現役名單（含位置）

```
GET /api/v1/teams/{teamId}/roster?rosterType=active&season={year}
```

回傳結構：
```jsonc
{
  "roster": [
    {
      "person": { "id": 660271, "fullName": "Shohei Ohtani" },
      "jerseyNumber": "17",
      "position": { "abbreviation": "TWP", "type": "Two-Way Player" }
    }
  ]
}
```

### 3. 取得球員打擊數據

```
GET /api/v1/people/{playerId}/stats?stats=season&season={year}&group=hitting
```

回傳結構：
```jsonc
{
  "stats": [{
    "splits": [{
      "stat": {
        "avg": ".282",
        "hits": 172,
        "homeRuns": 55,
        "baseOnBalls": 109,
        "ops": "1.014",
        "rbi": 102,
        "stolenBases": 20,
        "strikeOuts": 187,
        "runs": 146
      }
    }]
  }]
}
```

無資料時 `splits` 為空陣列。

### 4. 取得球員投球數據

```
GET /api/v1/people/{playerId}/stats?stats=season&season={year}&group=pitching
```

欄位範例：
```
era, whip, strikeOuts, inningsPitched, wins, losses, saves, baseOnBalls, homeRuns, earnedRuns, gamesPlayed
```

### 5. 球員大頭照

```
https://img.mlbstatic.com/mlb-photos/image/upload/w_{width},q_auto:best/v1/people/{playerId}/headshot/67/current.png
```

- 公開 CDN、CORS 開放
- 無照片時 API 回 generic 預設頭像（不會 404）
- `w_213` 是常用尺寸，可依需求改

## 球員身分辨識（打者 / 投手）

### position.abbreviation 對照

| 代碼 | 意義 | 屬於哪個 mode |
|---|---|---|
| `P` | Pitcher | 投手池 |
| `TWP` | Two-Way Player（雙棲） | 打者池 + 投手池 |
| `C` / `1B` / `2B` / `3B` / `SS` / `LF` / `CF` / `RF` / `OF` / `DH` / `IF` | 各野手位置 | 打者池 |

### 實作建議

判斷球員可進入哪個池：
- `position.abbreviation === 'P'` → 只進投手池
- `position.abbreviation === 'TWP'` → 進兩個池
- 其他 → 只進打者池

## 年份 / 賽季範圍

- API 從 1901 開始都有資料，球隊數會隨歷史變化（1901 = 16 隊、現在 = 30 隊）
- 前端策略：年份下拉開放任一年，球員 + 年份組合無資料就顯示 `—`（依規格 spec）

## CORS 確認結果

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

不需要 Vite proxy。

## 範例：完整資料流（呈現「2025 大谷 vs 2024 Judge」）

1. `GET /teams?sportId=1&season=2025` → 取出聯盟 / 球隊列表填下拉
2. 使用者選了「LAD」→ `GET /teams/119/roster?rosterType=active&season=2025` → 列球員（含大谷 TWP）
3. 使用者選了「大谷」+ 「2025」 + mode = batting → `GET /people/660271/stats?stats=season&season=2025&group=hitting`
4. 同步顯示 headshot：`https://img.mlbstatic.com/.../v1/people/660271/headshot/67/current.png`
5. B 側同樣流程，但年份用 2024、group 維持 hitting

## 已知關鍵 ID（開發 / 預設用）

| 球員 | ID | 球隊 |
|---|---|---|
| Shohei Ohtani | 660271 | LAD (119) |
| Aaron Judge | 592450 | NYY (147) |
| Tarik Skubal | 669373 | DET (116) |
| Paul Skenes | 694973 | PIT (134) |

> 上面只是預設用，實際球隊 / 球員 id 都從 API 動態取得，不要寫死在邏輯裡。
