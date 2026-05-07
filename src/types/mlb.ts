export interface RawTeam {
  id: number
  name: string
  abbreviation: string
  league: { name: string }
  division: { name: string }
}

export interface RawTeamsResponse {
  teams: RawTeam[]
}

export interface RawRosterEntry {
  person: {
    id: number
    fullName: string
  }
  jerseyNumber: string
  position: {
    abbreviation: string
  }
  status: {
    code: string
  }
}

export interface RawRosterResponse {
  roster: RawRosterEntry[]
}

export interface RawBattingStat {
  avg: string
  hits: number
  homeRuns: number
  baseOnBalls: number
  ops: string
  rbi: number
  stolenBases: number
  strikeOuts: number
  runs: number
}

export interface RawPitchingStat {
  era: string
  whip: string
  strikeOuts: number
  inningsPitched: string
  wins: number
  losses: number
  saves: number
  baseOnBalls: number
  homeRuns: number
  earnedRuns: number
  gamesPlayed: number
}

export interface RawStatsResponse<T> {
  stats: Array<{
    splits: Array<{ stat: T }>
  }>
}
