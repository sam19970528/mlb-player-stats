const BASE = 'https://statsapi.mlb.com/api/v1'

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`MLB API ${res.status} ${res.statusText}: ${url}`)
  }
  return res.json()
}

// 取得某季 MLB 所有球隊（含聯盟、分區）
export function fetchTeams(season: number) {
  return getJson(`${BASE}/teams?sportId=1&season=${season}`)
}

// 取得某隊某季的 40 人名單（含 IL，不含小聯盟）
export function fetchRoster(teamId: number, season: number) {
  return getJson(
    `${BASE}/teams/${teamId}/roster?rosterType=40Man&season=${season}`,
  )
}

// 取得球員某季的打擊數據
export function fetchBattingStats(playerId: number, season: number) {
  return getJson(
    `${BASE}/people/${playerId}/stats?stats=season&season=${season}&group=hitting`,
  )
}

// 取得球員某季的投球數據
export function fetchPitchingStats(playerId: number, season: number) {
  return getJson(
    `${BASE}/people/${playerId}/stats?stats=season&season=${season}&group=pitching`,
  )
}
