import { useState } from 'react'
import { TEAMS, LEAGUE_NAME } from '../constants'
import type { TeamName } from '../constants'

interface TeamSelectorProps {
  onSelect: (team: TeamName) => void
}

export function TeamSelector({ onSelect }: TeamSelectorProps) {
  const [selected, setSelected] = useState<TeamName | ''>('')

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl md:text-4xl text-gold uppercase text-center mb-2">
          {LEAGUE_NAME}
        </h1>
        <h2 className="font-label text-lg text-card/70 text-center mb-8 tracking-wide">
          Draft Day Board
        </h2>

        <div className="bg-card rounded-lg p-6 shadow-card">
          <label
            htmlFor="team-select"
            className="block font-label text-sm font-semibold text-felt uppercase tracking-wider mb-3"
          >
            Select Your Team
          </label>
          <select
            id="team-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value as TeamName)}
            className="w-full rounded-md border border-card-border bg-white px-3 py-3 font-body text-base text-felt-dark focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          >
            <option value="" disabled>
              Choose your team…
            </option>
            {TEAMS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>

          <button
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className="mt-5 w-full rounded-md bg-gold min-h-[44px] py-3 font-label text-sm font-bold uppercase tracking-wider text-felt-dark transition-all hover:bg-gold-light active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            Enter the War Room
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-card/50 font-body">
          One team per device. Pick yours — voting opens inside.
        </p>
      </div>
    </div>
  )
}
