import { useState } from 'react'

interface InlineCreateFieldProps {
  onCreate: (name: string) => void | Promise<void>
  label?: string
  placeholder?: string
}

export function InlineCreateField({
  onCreate,
  label = '+ New',
  placeholder = 'Name…',
}: InlineCreateFieldProps) {
  const [active, setActive] = useState(false)
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (trimmed) onCreate(trimmed)
    setValue('')
    setActive(false)
  }

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className="cursor-pointer text-2xs font-medium text-gray-400 hover:text-ink"
      >
        {label}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            submit()
          }
          if (e.key === 'Escape') {
            setValue('')
            setActive(false)
          }
        }}
        onBlur={() => {
          if (!value.trim()) setActive(false)
        }}
        placeholder={placeholder}
        className="w-28 rounded-md border-[1.5px] border-gray-200 bg-white px-2 py-0.5 text-2xs text-ink outline-none focus:border-gray-400"
      />
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={submit}
        className="cursor-pointer text-2xs font-medium text-ink hover:opacity-70"
      >
        Add
      </button>
    </div>
  )
}
