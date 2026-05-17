import { AVATAR_COLORS } from './constants'
import type { Scene } from './types'

export function avatarColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = name.charCodeAt(i) + ((h << 5) - h)
  }
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function sortScenes(scenes: Scene[]): Scene[] {
  return [...scenes].sort((a, b) => a.sort_order - b.sort_order)
}

export function totalWordCount(scenes: Scene[]): number {
  return scenes.reduce((sum, s) => sum + (s.word_count || 0), 0)
}

export function wordProgress(
  scenes: Scene[],
  target: number | null,
): { total: number; pct: number | null; display: string } {
  const total = totalWordCount(scenes)
  if (!target) {
    return { total, pct: null, display: total.toLocaleString() }
  }
  const pct = Math.min(100, Math.round((total / target) * 100))
  return {
    total,
    pct,
    display: `${total.toLocaleString()} / ${Number(target).toLocaleString()}`,
  }
}
