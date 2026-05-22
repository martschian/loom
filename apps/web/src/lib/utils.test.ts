import { describe, expect, it } from 'vitest'
import {
  avatarColor,
  initials,
  sortScenes,
  totalWordCount,
  wordProgress,
} from '@/lib/utils'
import type { Scene } from '@/lib/types'

describe('avatarColor', () => {
  it('returns a consistent color for the same name', () => {
    expect(avatarColor('Alice')).toBe(avatarColor('Alice'))
  })

  it('returns a hex color string', () => {
    expect(avatarColor('Bob')).toMatch(/^#[0-9a-f]{6}$/i)
  })
})

describe('initials', () => {
  it('returns up to two uppercase initials', () => {
    expect(initials('Alice Marlowe')).toBe('AM')
    expect(initials('Bob')).toBe('B')
  })

  it('handles empty and extra whitespace', () => {
    expect(initials('')).toBe('')
    expect(initials('  Ada   Lovelace  ')).toBe('AL')
  })
})

describe('sortScenes', () => {
  it('sorts by sort_order ascending', () => {
    const scenes = [
      { sort_order: 2 } as Scene,
      { sort_order: 0 } as Scene,
      { sort_order: 1 } as Scene,
    ]
    expect(sortScenes(scenes).map((s) => s.sort_order)).toEqual([0, 1, 2])
    expect(scenes.map((s) => s.sort_order)).toEqual([2, 0, 1])
  })
})

describe('totalWordCount', () => {
  it('sums word counts', () => {
    const scenes = [
      { word_count: 100 } as Scene,
      { word_count: 250 } as Scene,
    ]
    expect(totalWordCount(scenes)).toBe(350)
  })

  it('treats missing word counts as zero', () => {
    const scenes = [{ word_count: 100 } as Scene, {} as Scene]
    expect(totalWordCount(scenes)).toBe(100)
  })
})

describe('wordProgress', () => {
  it('returns pct when target is set', () => {
    const scenes = [{ word_count: 4000 } as Scene]
    const result = wordProgress(scenes, 8000)
    expect(result.pct).toBe(50)
    expect(result.display).toMatch(/4.000 \/ 8.000/)
  })

  it('returns null pct without target', () => {
    const scenes = [{ word_count: 100 } as Scene]
    const result = wordProgress(scenes, null)
    expect(result.pct).toBeNull()
    expect(result.display).toBe('100')
  })

  it('caps progress percentage at 100', () => {
    const scenes = [{ word_count: 10_000 } as Scene]
    const result = wordProgress(scenes, 5000)
    expect(result.pct).toBe(100)
  })
})
