import { useState } from 'react'

interface AddDateFormProps {
  onAdd: (date: string, label?: string) => void
}

export function AddDateForm({ onAdd }: AddDateFormProps) {
  const [date, setDate] = useState('')
  const [label, setLabel] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) return
    onAdd(date, label.trim() || undefined)
    setDate('')
    setLabel('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-lg border-2 border-dashed border-card/20 min-h-[48px] py-4 font-label text-sm font-semibold text-card/50 uppercase tracking-wider hover:border-gold/40 hover:text-gold/80 transition-colors motion-reduce:transition-none"
      >
        + Add a Date
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-4 shadow-card">
      <p className="font-label text-sm font-semibold text-felt uppercase tracking-wider mb-3">
        Add Candidate Date
      </p>

      <div className="space-y-3">
        <div>
          <label htmlFor="date-input" className="block font-body text-xs text-felt/60 mb-1">
            Date
          </label>
          <input
            id="date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-md border border-card-border bg-white px-3 py-2.5 font-body text-base text-felt-dark focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="label-input" className="block font-body text-xs text-felt/60 mb-1">
            Note <span className="text-felt/40">(optional)</span>
          </label>
          <input
            id="label-input"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Labor Day weekend"
            maxLength={60}
            className="w-full rounded-md border border-card-border bg-white px-3 py-2.5 font-body text-base text-felt-dark placeholder:text-felt/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={!date}
          className="flex-1 rounded-md bg-gold min-h-[44px] py-2.5 font-label text-sm font-bold uppercase tracking-wider text-felt-dark transition-all hover:bg-gold-light active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add to Board
        </button>
        <button
          type="button"
          onClick={() => { setIsOpen(false); setDate(''); setLabel('') }}
          className="rounded-md border border-card-border px-4 min-h-[44px] py-2.5 font-label text-xs font-medium text-felt/50 uppercase tracking-wider hover:border-felt/40 transition-colors motion-reduce:transition-none"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
