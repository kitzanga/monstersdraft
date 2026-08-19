import type { TeamName } from './constants'

export interface CandidateDate {
  id: string
  date: string // ISO date string YYYY-MM-DD
  label?: string
  created_at: string
}

export interface Vote {
  id: string
  candidate_date_id: string
  team_name: TeamName
  created_at: string
}

export interface BoardState {
  title: string
  candidateDates: CandidateDate[]
  votes: Vote[]
}
