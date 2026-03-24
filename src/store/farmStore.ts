import { create } from 'zustand'
import type { Farm, FarmFilters, FarmCategory } from '@/types/farm'

interface FarmStore {
  // Selection
  selectedFarmId: string | null
  hoveredFarmId: string | null

  // Filters
  filters: FarmFilters

  // Actions — selection
  selectFarm: (id: string | null) => void
  hoverFarm: (id: string | null) => void

  // Actions — filters
  toggleCategory: (category: FarmCategory) => void
  setKraj: (kraj: FarmFilters['kraj']) => void
  setOpenNow: (value: boolean) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
}

const defaultFilters: FarmFilters = {
  categories: [],
  kraj: null,
  openNow: false,
  searchQuery: '',
}

export const useFarmStore = create<FarmStore>((set) => ({
  selectedFarmId: null,
  hoveredFarmId: null,
  filters: defaultFilters,

  selectFarm: (id) => set({ selectedFarmId: id }),

  hoverFarm: (id) => set({ hoveredFarmId: id }),

  toggleCategory: (category) =>
    set((state) => {
      const { categories } = state.filters
      const next = categories.includes(category)
        ? categories.filter((c) => c !== category)
        : [...categories, category]
      return { filters: { ...state.filters, categories: next } }
    }),

  setKraj: (kraj) =>
    set((state) => ({ filters: { ...state.filters, kraj } })),

  setOpenNow: (value) =>
    set((state) => ({ filters: { ...state.filters, openNow: value } })),

  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),

  clearFilters: () => set({ filters: defaultFilters }),
}))

// Selector helpers
export const selectHasActiveFilters = (state: FarmStore): boolean =>
  state.filters.categories.length > 0 ||
  state.filters.kraj !== null ||
  state.filters.openNow ||
  state.filters.searchQuery.trim().length > 0

// Derive filtered farms outside store to avoid coupling to data layer
export function getFilteredFarms(farms: Farm[], store: FarmStore): Farm[] {
  const { filters } = store
  return farms.filter((farm) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.some((cat) => farm.categories.includes(cat))
    )
      return false
    if (filters.kraj && farm.location.kraj !== filters.kraj) return false
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase()
      if (
        !farm.name.toLowerCase().includes(q) &&
        !farm.location.city.toLowerCase().includes(q) &&
        !farm.description.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })
}
