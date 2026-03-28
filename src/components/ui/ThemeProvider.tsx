'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mf_prefs')
      if (raw) {
        const prefs = JSON.parse(raw) as { darkMode?: boolean }
        document.documentElement.classList.toggle('dark', !!prefs.darkMode)
      }
    } catch {
      // ignore
    }
  }, [])

  return <>{children}</>
}
