interface TagProps {
  label: string
  color?: string
}

export function Tag({ label, color = 'var(--color-accent)' }: TagProps) {
  return (
    <span
      className="whitespace-nowrap rounded px-2 py-0.5 text-2xs font-medium tracking-wide"
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  )
}
