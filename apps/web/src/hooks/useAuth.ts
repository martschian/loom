import { createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

export interface AuthContextValue {
  session: Session | { user: { id: string } } | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>
  signOut: () => Promise<void>
  userId: string | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
