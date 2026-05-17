interface TagProps {
  label: string
  color?: string
}

export function Tag({ label, color = '#6366f1' }: TagProps) {
  return (
    <span
      className="whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-medium tracking-wide"
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
