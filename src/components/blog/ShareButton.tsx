'use client'

import { Share2 } from 'lucide-react'

export function ShareButton({ title }: { title: string }) {
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({ title, url: window.location.href })
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-medium transition-colors cursor-pointer"
      aria-label="Sdílet článek"
    >
      <Share2 className="w-4 h-4" aria-hidden="true" />
      Sdílet
    </button>
  )
}
