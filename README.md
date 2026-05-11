# MLB Player Stats

兩位 MLB 球員並列比較數據的小工具，台灣球迷視角。

Demo：<https://mlb-player-stats.vercel.app>

## 主要特點

- 打者 / 投手雙模式，各自獨立記憶 A、B 兩側選擇
- 跨年份比較（1876 ~ 當前年）
- 球隊、聯盟全中文，操作直覺
- 串接 MLB Stats API，roster 用 40-man（傷兵也找得到）
- 球員大頭照、左右打投、身高、背號完整顯示
- Stats 自動標出勝者
- 選擇值寫進 localStorage，下次進站還原

## 技術棧

- Vue 3
- Vite
- TypeScript
- UnoCSS
- Pinia + pinia-plugin-persistedstate
- vue-router
- MLB Stats API

## 啟動

需要 Node 22+。

```bash
npm install
npm run dev      # 本地開發 (http://localhost:5173)
npm run build    # 編譯產出
npm run preview  # 預覽 build 結果
```

## 路由

| Path | 說明 |
|---|---|
| `/` | redirect 到 `/batting` |
| `/batting` | 打者比較 |
| `/pitching` | 投手比較 |

## 未來規劃

- 資料視覺化：用不同 UI（卡片、球場視角等）呈現數據差異
- 列表模式：一次比較多名球員，可依任一欄位排序
- 跨年份比較：A、B 兩側獨立年份（例：2025 大谷 vs 2018 鱒魚）
- 隊伍數據比較
- 單一球員深度查詢、加入更多進階數據分析

## 文件

- 規格與架構：[docs/player-compare/spec.md](docs/player-compare/spec.md)
- API 串接細節：[docs/player-compare/api.md](docs/player-compare/api.md)
- 開發準則：[CLAUDE.md](CLAUDE.md)
