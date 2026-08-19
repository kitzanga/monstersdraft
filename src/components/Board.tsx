import { DRAFT_TIME, LEAGUE_SIZE, TEAMS } from '../constants'
import type { TeamName } from '../constants'
import { useBoard } from '../hooks/useBoard'
import { DateCard } from './DateCard'
import { AddDateForm } from './AddDateForm'
import { LeadingContenderBanner } from './LeadingContenderBanner'
import { EditableTitle } from './EditableTitle'

interface BoardProps {
  currentTeam: TeamName
  onChangeTeam: () => void
}

export function Board({ currentTeam, onChangeTeam }: BoardProps) {
  const {
    title,
    candidateDates,
    votes,
    loading,
    error,
    updateTitle,
    addDate,
    removeDate,
    toggleVote,
  } = useBoard()

  const handleVote = (candidateDateId: string) => {
    toggleVote(candidateDateId, currentTeam)
  }

  // Determine leading contender
  const voteCounts = candidateDates.map((cd) => ({
    candidateDate: cd,
    votes: votes.filter((v) => v.candidate_date_id === cd.id),
    count: votes.filter((v) => v.candidate_date_id === cd.id).length,
  }))

  const maxVotes = Math.max(0, ...voteCounts.map((vc) => vc.count))
  const leader = maxVotes > 0 ? voteCounts.find((vc) => vc.count === maxVotes) : null

  const missingTeams = leader
    ? (TEAMS.filter(
        (team) => !leader.votes.some((v) => v.team_name === team)
      ) as TeamName[])
    : []

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="font-label text-sm text-card/50 mt-3 uppercase tracking-wider">
            Loading the board…
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="bg-card rounded-lg p-6 shadow-card max-w-sm text-center">
          <p className="font-label text-sm font-semibold text-pin uppercase tracking-wider mb-2">
            Connection Error
          </p>
          <p className="font-body text-sm text-felt/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-gold px-4 py-2 font-label text-sm font-bold uppercase tracking-wider text-felt-dark hover:bg-gold-light transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh px-4 py-6 pb-24 max-w-lg md:max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <EditableTitle title={title} onTitleChange={updateTitle} />
        <button
          onClick={onChangeTeam}
          className="flex-shrink-0 ml-3 mt-1 text-xs font-label text-card/50 hover:text-gold transition-colors"
          aria-label="Switch team"
        >
          Switch&nbsp;team
        </button>
      </div>

      <p className="font-label text-sm md:text-base text-gold/80 mb-1 tracking-wide">
        All dates start at {DRAFT_TIME}
      </p>
      <p className="font-body text-xs md:text-sm text-card/50 mb-6">
        Voting as <span className="text-gold font-semibold">{currentTeam}</span>
      </p>

      {/* Leading Contender */}
      {leader && (
        <LeadingContenderBanner
          candidateDate={leader.candidateDate}
          voteCount={leader.count}
          leagueSize={LEAGUE_SIZE}
          missingTeams={missingTeams}
        />
      )}

      {/* Date Cards */}
      <div className="space-y-4 mb-6">
        {candidateDates.map((cd) => {
          const dateVotes = votes.filter((v) => v.candidate_date_id === cd.id)
          const hasVoted = dateVotes.some((v) => v.team_name === currentTeam)
          return (
            <DateCard
              key={cd.id}
              candidateDate={cd}
              votes={dateVotes}
              currentTeam={currentTeam}
              hasVoted={hasVoted}
              onVote={() => handleVote(cd.id)}
              onRemove={() => removeDate(cd.id)}
              canRemove={dateVotes.length === 0}
              leagueSize={LEAGUE_SIZE}
            />
          )
        })}
      </div>

      {candidateDates.length === 0 && (
        <div className="text-center py-12">
          <p className="font-label text-lg text-card/40 uppercase tracking-wider">
            No dates on the board yet
          </p>
          <p className="font-body text-sm text-card/30 mt-1">
            Add a candidate date below to get started
          </p>
        </div>
      )}

      {/* Add Date Form */}
      <AddDateForm onAdd={addDate} />
    </div>
  )
}
