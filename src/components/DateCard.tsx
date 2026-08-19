import type { TeamName } from '../constants'
import type { CandidateDate, Vote } from '../types'

interface DateCardProps {
  candidateDate: CandidateDate
  votes: Vote[]
  currentTeam: TeamName
  hasVoted: boolean
  onVote: () => void
  onRemove: () => void
  canRemove: boolean
  leagueSize: number
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function DateCard({
  candidateDate,
  votes,
  hasVoted,
  onVote,
  onRemove,
  canRemove,
  leagueSize,
}: DateCardProps) {
  const voteCount = votes.length
  const allIn = voteCount === leagueSize

  return (
    <div
      className="relative bg-card rounded-lg p-4 shadow-card transition-shadow duration-200 hover:shadow-card-hover motion-reduce:transition-none animate-card-in motion-reduce:animate-none"
    >
      {/* Pin detail */}
      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-pin shadow-pin" aria-hidden="true" />

      {/* Date & label */}
      <div className="pr-6">
        <p className="font-display text-xl md:text-2xl text-felt-dark uppercase leading-tight">
          {formatDate(candidateDate.date)}
        </p>
        {candidateDate.label && (
          <p className="font-body text-xs text-felt/60 mt-0.5">{candidateDate.label}</p>
        )}
      </div>

      {/* Vote count bar */}
      <div className="mt-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-felt/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${allIn ? 'bg-gold' : 'bg-gold/60'}`}
              style={{ width: `${(voteCount / leagueSize) * 100}%` }}
            />
          </div>
          <span className="font-label text-xs font-semibold text-felt/70 whitespace-nowrap">
            {voteCount}/{leagueSize}
          </span>
        </div>
      </div>

      {/* Voted teams */}
      {voteCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {votes.map((v) => (
            <span
              key={v.id}
              className="inline-block rounded-full bg-felt/10 px-2 py-0.5 font-label text-[11px] md:text-xs font-medium text-felt/80"
            >
              {v.team_name}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onVote}
          className={`flex-1 rounded-md min-h-[44px] py-2.5 font-label text-sm md:text-base font-bold uppercase tracking-wider transition-all active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 ${
            hasVoted
              ? 'bg-felt text-card hover:bg-felt-light'
              : 'bg-gold text-felt-dark hover:bg-gold-light'
          }`}
        >
          {hasVoted ? "I'm Out" : "I'm In"}
        </button>

        {canRemove && (
          <button
            onClick={onRemove}
            className="rounded-md border border-felt/20 px-3 min-h-[44px] py-2.5 font-label text-xs font-medium text-felt/50 uppercase tracking-wider hover:border-pin/50 hover:text-pin transition-colors motion-reduce:transition-none"
            aria-label={`Remove ${formatDate(candidateDate.date)}`}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
