import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { TeamName } from '../constants'
import type { CandidateDate, Vote } from '../types'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface BoardData {
  title: string
  candidateDates: CandidateDate[]
  votes: Vote[]
  loading: boolean
  error: string | null
}

interface BoardActions {
  updateTitle: (title: string) => Promise<void>
  addDate: (date: string, label?: string) => Promise<void>
  removeDate: (dateId: string) => Promise<void>
  toggleVote: (candidateDateId: string, teamName: TeamName) => Promise<void>
}

export function useBoard(): BoardData & BoardActions {
  const [title, setTitle] = useState('Draft Day Board')
  const [candidateDates, setCandidateDates] = useState<CandidateDate[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Initial data fetch
  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError(null)

      const [boardRes, datesRes, votesRes] = await Promise.all([
        supabase.from('board').select('*').eq('id', 1).single(),
        supabase.from('candidate_dates').select('*').order('date', { ascending: true }),
        supabase.from('votes').select('*'),
      ])

      if (boardRes.error) {
        setError(`Failed to load board: ${boardRes.error.message}`)
        setLoading(false)
        return
      }
      if (datesRes.error) {
        setError(`Failed to load dates: ${datesRes.error.message}`)
        setLoading(false)
        return
      }
      if (votesRes.error) {
        setError(`Failed to load votes: ${votesRes.error.message}`)
        setLoading(false)
        return
      }

      setTitle(boardRes.data.title)
      setCandidateDates(datesRes.data as CandidateDate[])
      setVotes(votesRes.data as Vote[])
      setLoading(false)
    }

    fetchAll()
  }, [])

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('board-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'board' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setTitle((payload.new as { title: string }).title)
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'candidate_dates' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setCandidateDates((prev) => {
              const newDate = payload.new as CandidateDate
              // Avoid duplicates (in case we already optimistically added it)
              if (prev.some((d) => d.id === newDate.id)) return prev
              return [...prev, newDate].sort((a, b) => a.date.localeCompare(b.date))
            })
          }
          if (payload.eventType === 'DELETE' && payload.old) {
            const oldId = (payload.old as { id: string }).id
            setCandidateDates((prev) => prev.filter((d) => d.id !== oldId))
            // Also remove votes for that date
            setVotes((prev) => prev.filter((v) => v.candidate_date_id !== oldId))
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setVotes((prev) => {
              const newVote = payload.new as Vote
              if (prev.some((v) => v.id === newVote.id)) return prev
              return [...prev, newVote]
            })
          }
          if (payload.eventType === 'DELETE' && payload.old) {
            const oldId = (payload.old as { id: string }).id
            setVotes((prev) => prev.filter((v) => v.id !== oldId))
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const updateTitle = useCallback(async (newTitle: string) => {
    setTitle(newTitle) // optimistic
    const { error } = await supabase
      .from('board')
      .update({ title: newTitle })
      .eq('id', 1)

    if (error) {
      console.error('Failed to update title:', error.message)
    }
  }, [])

  const addDate = useCallback(async (date: string, label?: string) => {
    const { error } = await supabase
      .from('candidate_dates')
      .insert({ date, label: label || null })

    if (error) {
      console.error('Failed to add date:', error.message)
      setError(`Failed to add date: ${error.message}`)
    }
  }, [])

  const removeDate = useCallback(async (dateId: string) => {
    // Optimistic removal
    setCandidateDates((prev) => prev.filter((d) => d.id !== dateId))

    const { error } = await supabase
      .from('candidate_dates')
      .delete()
      .eq('id', dateId)

    if (error) {
      console.error('Failed to remove date:', error.message)
      // Refetch on error
      const { data } = await supabase
        .from('candidate_dates')
        .select('*')
        .order('date', { ascending: true })
      if (data) setCandidateDates(data as CandidateDate[])
    }
  }, [])

  const toggleVote = useCallback(async (candidateDateId: string, teamName: TeamName) => {
    // Check if vote already exists
    const existingVote = votes.find(
      (v) => v.candidate_date_id === candidateDateId && v.team_name === teamName
    )

    if (existingVote) {
      // Optimistic removal
      setVotes((prev) => prev.filter((v) => v.id !== existingVote.id))

      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('id', existingVote.id)

      if (error) {
        console.error('Failed to remove vote:', error.message)
        // Restore on error
        setVotes((prev) => [...prev, existingVote])
      }
    } else {
      // Optimistic insertion with temp ID
      const tempVote: Vote = {
        id: crypto.randomUUID(),
        candidate_date_id: candidateDateId,
        team_name: teamName,
        created_at: new Date().toISOString(),
      }
      setVotes((prev) => [...prev, tempVote])

      const { data, error } = await supabase
        .from('votes')
        .insert({ candidate_date_id: candidateDateId, team_name: teamName })
        .select()
        .single()

      if (error) {
        console.error('Failed to add vote:', error.message)
        // Remove optimistic vote on error
        setVotes((prev) => prev.filter((v) => v.id !== tempVote.id))
      } else if (data) {
        // Replace temp vote with real one (realtime might also do this, dedup handles it)
        setVotes((prev) =>
          prev.map((v) => (v.id === tempVote.id ? (data as Vote) : v))
        )
      }
    }
  }, [votes])

  return {
    title,
    candidateDates,
    votes,
    loading,
    error,
    updateTitle,
    addDate,
    removeDate,
    toggleVote,
  }
}
