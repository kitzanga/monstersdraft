import { useRef, useState } from 'react'

interface EditableTitleProps {
  title: string
  onTitleChange: (title: string) => void
}

export function EditableTitle({ title, onTitleChange }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleBlur = () => {
    setIsEditing(false)
    const val = inputRef.current?.value.trim()
    if (val && val !== title) {
      onTitleChange(val)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      if (inputRef.current) inputRef.current.value = title
      inputRef.current?.blur()
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        defaultValue={title}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        maxLength={40}
        className="font-display text-2xl md:text-3xl text-gold uppercase bg-transparent border-b-2 border-gold/40 focus:border-gold outline-none w-full"
        aria-label="Board title"
      />
    )
  }

  return (
    <h1
      onClick={() => setIsEditing(true)}
      className="font-display text-2xl md:text-3xl text-gold uppercase cursor-pointer hover:text-gold-light transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') setIsEditing(true) }}
      aria-label="Click to edit board title"
    >
      {title}
    </h1>
  )
}
