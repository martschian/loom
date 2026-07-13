import { useState } from 'react'

export interface ComboboxOption {
  id: string
  label: string
  color?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string | null
  onChange: (id: string | null) => void
  onCreate: (name: string) => void | Promise<void>
  placeholder?: string
  emptyLabel?: string
  className?: string
}

export function Combobox({
  options,
  value,
  onChange,
  onCreate,
  placeholder = 'Search or create…',
  emptyLabel = 'None',
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const selected = options.find((o) => o.id === value) ?? null

  const trimmed = query.trim()
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(trimmed.toLowerCase()),
  )
  const exactMatch = options.some(
    (o) => o.label.toLowerCase() === trimmed.toLowerCase(),
  )
  const showCreate = trimmed.length > 0 && !exactMatch

  const inputClass =
    'w-full rounded-lg border-[1.5px] border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gray-400 box-border'

  return (
    <div className={`relative${className ? ` ${className}` : ''}`}>
      <input
        value={isOpen ? query : selected?.label ?? query}
        onFocus={() => {
          setIsOpen(true)
          setQuery('')
        }}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
        placeholder={placeholder}
        className={inputClass}
      />
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-52 overflow-y-auto rounded-lg border-[1.5px] border-gray-200 bg-white p-1 shadow-xl">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onChange(null)
              setIsOpen(false)
            }}
            className="block w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left text-sm text-gray-400 hover:bg-gray-50"
          >
            {emptyLabel}
          </button>
          {filtered.map((o) => (
            <button
              key={o.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(o.id)
                setIsOpen(false)
              }}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-ink hover:bg-gray-50"
            >
              {o.color && (
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: o.color }}
                />
              )}
              {o.label}
            </button>
          ))}
          {showCreate && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onCreate(trimmed)
                setIsOpen(false)
              }}
              className="block w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left text-sm font-medium text-ink hover:bg-gray-50"
            >
              + Create &quot;{trimmed}&quot;
            </button>
          )}
          {filtered.length === 0 && !showCreate && (
            <div className="px-2.5 py-1.5 text-sm text-gray-400">No matches</div>
          )}
        </div>
      )}
    </div>
  )
}
