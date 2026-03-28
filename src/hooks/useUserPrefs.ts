'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FarmCategory, KrajCode } from '@/types/farm'

const STORAGE_KEY = 'mf_prefs'

export type DefaultView = 'map' | 'list'
export type CardSize = 'compact' | 'full'
export type BedynkaFrequency = 'weekly' | 'biweekly' | 'monthly' | null

export interface UserPrefs {
  categories: FarmCategory[]
  kraj: KrajCode | null
  defaultView: DefaultView
  cardSize: CardSize
  darkMode: boolean
  searchRadius: number // km
  bedynkaFrequency: BedynkaFrequency
}

const DEFAULT_PREFS: UserPrefs = {
  categories: [],
  kraj: null,
  defaultView: 'map',
  cardSize: 'full',
  darkMode: false,
  searchRadius: 30,
  bedynkaFrequency: null,
}

function readStorage(): UserPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<UserPrefs>) }
  } catch {
    return DEFAULT_PREFS
  }
}

function writeStorage(prefs: UserPrefs): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // ignore quota errors
  }
}

export function useUserPrefs() {
  const [prefs, setPrefs] = useState<UserPrefs>(DEFAULT_PREFS)

  useEffect(() => {
    const stored = readStorage()
    setPrefs(stored)
    applyDarkMode(stored.darkMode)
  }, [])

  const update = useCallback((patch: Partial<UserPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch }
      writeStorage(next)
      if ('darkMode' in patch) applyDarkMode(next.darkMode)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    writeStorage(DEFAULT_PREFS)
    setPrefs(DEFAULT_PREFS)
    applyDarkMode(DEFAULT_PREFS.darkMode)
  }, [])

  return { prefs, update, reset }
}

function applyDarkMode(enabled: boolean): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', enabled)
}
