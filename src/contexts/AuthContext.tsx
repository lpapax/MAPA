'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseClientSingleton } from '@/lib/supabase'

interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClientSingleton()
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signInWithMagicLink = async (email: string): Promise<{ error: string | null }> => {
    const supabase = getSupabaseClientSingleton()
    if (!supabase) return { error: 'Supabase není nakonfigurován.' }

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : '/auth/callback'

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    return { error: error ? error.message : null }
  }

  const signOut = async () => {
    const supabase = getSupabaseClientSingleton()
    if (!supabase) return
    await supabase.auth.signOut()
    setSession(null)
  }

  const deleteAccount = async (): Promise<{ error: string | null }> => {
    if (!session) return { error: 'Nejste přihlášeni.' }
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        return { error: body.error ?? 'Nepodařilo se smazat účet.' }
      }
      await signOut()
      return { error: null }
    } catch {
      return { error: 'Chyba sítě. Zkuste to znovu.' }
    }
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signInWithMagicLink, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
