'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'mf_bedynka'
const MAX_ITEMS = 20

export interface BedynkaItem {
  id: string       // unique key: farmSlug + productId
  productId: string
  productName: string
  price: string
  unit: string
  farmSlug: string
  farmName: string
  quantity: number
}

function readStorage(): BedynkaItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as BedynkaItem[]) : []
  } catch {
    return []
  }
}

function writeStorage(items: BedynkaItem[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore quota errors
  }
}

export function useBedynka() {
  const [items, setItems] = useState<BedynkaItem[]>([])

  useEffect(() => {
    setItems(readStorage())
  }, [])

  const isInBedynka = useCallback(
    (itemId: string) => items.some((i) => i.id === itemId),
    [items],
  )

  const addItem = useCallback((item: Omit<BedynkaItem, 'id' | 'quantity'>) => {
    const id = `${item.farmSlug}__${item.productId}`
    setItems((prev) => {
      if (prev.some((i) => i.id === id)) return prev // already in list
      if (prev.length >= MAX_ITEMS) return prev       // max reached
      const next = [...prev, { ...item, id, quantity: 1 }]
      writeStorage(next)
      return next
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== itemId)
      writeStorage(next)
      return next
    })
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) => {
      const next = prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      writeStorage(next)
      return next
    })
  }, [])

  const clearBedynka = useCallback(() => {
    writeStorage([])
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return { items, isInBedynka, addItem, removeItem, updateQuantity, clearBedynka, totalItems }
}
