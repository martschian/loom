import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'
import { AuthContext, type AuthContextValue } from '@/hooks/useAuth'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { localStorageAdapter } from '@/lib/storage/local-storage-adapter'

const LOCAL_SESSION = { user: { id: 'local-user' } }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isLocal = !isSupabaseConfigured || !supabase

  const [session, setSession] = useState<AuthContextValue['session']>(() =>
    isLocal ? LOCAL_SESSION : null,
  )
  const [profile, setProfile] = useState<Profile | null>(() =>
    isLocal ? localStorageAdapter.getProfile() : null,
  )
  const [loading, setLoading] = useState(!isLocal)

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) throw error
    setProfile(data)
  }, [])

  useEffect(() => {
    if (isLocal || !supabase) return

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) loadProfile(s.user.id).finally(() => setLoading(false))
      else setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s: Session | null) => {
      setSession(s)
      if (s?.user) loadProfile(s.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [isLocal, loadProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      setSession(LOCAL_SESSION)
      setProfile(localStorageAdapter.getProfile())
      return {}
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!supabase) {
        localStorageAdapter.updateProfile(displayName)
        setSession(LOCAL_SESSION)
        setProfile(localStorageAdapter.getProfile())
        return {}
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      })
      return { error: error?.message }
    },
    [],
  )

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      userId: session?.user?.id ?? null,
    }),
    [session, profile, loading, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
