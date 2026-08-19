import { useState } from 'react'
import { TeamSelector } from './components/TeamSelector'
import { Board } from './components/Board'
import type { TeamName } from './constants'

const STORAGE_KEY = 'draftday_team'

function getStoredTeam(): TeamName | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored as TeamName | null
}

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState<TeamName | null>(getStoredTeam)

  const handleSelectTeam = (team: TeamName) => {
    localStorage.setItem(STORAGE_KEY, team)
    setSelectedTeam(team)
  }

  const handleChangeTeam = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSelectedTeam(null)
  }

  if (!selectedTeam) {
    return <TeamSelector onSelect={handleSelectTeam} />
  }

  return <Board currentTeam={selectedTeam} onChangeTeam={handleChangeTeam} />
}
