'use client'

import { useState, useEffect, useCallback } from 'react'

export type ConsentState = 'pending' | 'accepted' | 'rejected'

const STORAGE_KEY = 'mf_cookie_consent'

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState>('pending')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'accepted' || stored === 'rejected') {
        setConsent(stored)
      }
    } catch {
      // localStorage unavailable (SSR, private browsing with restrictions)
    }
    setHydrated(true)
  }, [])

  const accept = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, 'accepted') } catch {}
    setConsent('accepted')
  }, [])

  const reject = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, 'rejected') } catch {}
    setConsent('rejected')
  }, [])

  // Banner is shown only after hydration and only if no stored decision
  const showBanner = hydrated && consent === 'pending'

  return { consent, accept, reject, showBanner }
}
