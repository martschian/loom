import type { Mood } from './types'

export const AVATAR_COLORS = [
  '#7c3aed',
  '#0891b2',
  '#059669',
  '#d97706',
  '#dc2626',
  '#db2777',
  '#7c3aed',
]

export const CHAR_COLORS = [
  '#7c3aed',
  '#0891b2',
  '#059669',
  '#d97706',
  '#dc2626',
  '#db2777',
  '#6366f1',
  '#0d9488',
]

export const LOC_COLORS = [
  '#1d4ed8',
  '#065f46',
  '#92400e',
  '#7e1d5f',
  '#1e3a5f',
  '#3d1a0a',
]

export const MOODS: Mood[] = [
  'Joyful',
  'Tense',
  'Mysterious',
  'Ominous',
  'Melancholic',
  'Action',
  'Romantic',
  'Comedic',
  'Hopeful',
  'Dark',
]

export const MOOD_COLORS: Record<Mood, string> = {
  Joyful: '#f59e0b',
  Tense: '#ef4444',
  Mysterious: '#8b5cf6',
  Ominous: '#374151',
  Melancholic: '#0891b2',
  Action: '#dc2626',
  Romantic: '#ec4899',
  Comedic: '#10b981',
  Hopeful: '#3b82f6',
  Dark: '#1f2937',
}

export const NAV_TABS = [
  { id: 'timeline' as const, label: 'Timeline' },
  { id: 'characters' as const, label: 'Characters' },
  { id: 'locations' as const, label: 'Locations' },
]
