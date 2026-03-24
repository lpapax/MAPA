import { create } from 'zustand'

const MAX_COMPARE = 3

interface CompareStore {
  compareIds: string[]
  toggleCompare: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  compareIds: [],

  toggleCompare: (id) =>
    set((state) => {
      if (state.compareIds.includes(id)) {
        return { compareIds: state.compareIds.filter((i) => i !== id) }
      }
      if (state.compareIds.length >= MAX_COMPARE) return state
      return { compareIds: [...state.compareIds, id] }
    }),

  clearCompare: () => set({ compareIds: [] }),

  isInCompare: (id) => get().compareIds.includes(id),
}))

export const MAX_COMPARE_FARMS = MAX_COMPARE
