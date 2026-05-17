import { avatarColor, initials } from '@/lib/utils'

interface AvatarProps {
  name: string
  size?: number
}

export function Avatar({ name, size = 36 }: AvatarProps) {
  const color = avatarColor(name)
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-serif font-semibold tracking-wide text-white"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.38,
      }}
    >
      {initials(name)}
    </div>
  )
}
