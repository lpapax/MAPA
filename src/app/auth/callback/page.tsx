'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getSupabaseClientSingleton } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      // Implicit flow: Supabase sets session from URL hash automatically
      router.replace('/profil')
      return
    }

    const supabase = getSupabaseClientSingleton()
    if (!supabase) {
      setError('Supabase není nakonfigurován.')
      return
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error: err }) => {
      if (err) {
        setError(err.message)
      } else {
        router.replace('/profil')
      }
    })
  }, [searchParams, router])

  if (error) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-red-600 font-semibold mb-3">Přihlášení se nezdařilo</p>
          <p className="text-neutral-500 text-sm mb-6">{error}</p>
          <a href="/prihlasit" className="text-primary-600 hover:text-primary-700 text-sm font-medium underline">
            Zkusit znovu
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" aria-hidden="true" />
        <p className="text-sm text-neutral-500">Přihlašuji…</p>
      </div>
    </main>
  )
}
