import { LEAGUE_SIZE } from '../constants'
import type { TeamName } from '../constants'
import type { CandidateDate } from '../types'

interface LeadingContenderBannerProps {
  candidateDate: CandidateDate
  voteCount: number
  leagueSize: number
  missingTeams: TeamName[]
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function LeadingContenderBanner({
  candidateDate,
  voteCount,
  missingTeams,
}: LeadingContenderBannerProps) {
  const allIn = voteCount === LEAGUE_SIZE

  return (
    <div
      className={`rounded-lg p-4 mb-6 border-2 transition-colors ${
        allIn
          ? 'border-gold bg-gold/10'
          : 'border-gold/40 bg-gold/5'
      }`}
    >
      <p className="font-label text-xs md:text-sm font-semibold uppercase tracking-widest text-gold/70 mb-1">
        {allIn ? '🏆 All 12 Locked In' : 'Leading Contender'}
      </p>
      <p className="font-display text-xl md:text-2xl text-gold uppercase">
        {formatDate(candidateDate.date)}
      </p>
      {candidateDate.label && (
        <p className="font-body text-xs md:text-sm text-card/60 mt-0.5">{candidateDate.label}</p>
      )}
      <p className="font-label text-sm md:text-base text-card/80 mt-2">
        {allIn ? (
          <span className="text-gold font-bold">
            Every team is in. Lock it in, commish.
          </span>
        ) : (
          <>
            <span className="font-bold text-gold">{voteCount} of {LEAGUE_SIZE}</span>{' '}
            teams locked in
          </>
        )}
      </p>
      {!allIn && missingTeams.length > 0 && (
        <p className="font-body text-xs text-card/50 mt-1">
          Still waiting on:{' '}
          <span className="text-card/70">{missingTeams.join(', ')}</span>
        </p>
      )}
    </div>
  )
}
