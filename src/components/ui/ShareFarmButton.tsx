'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface ShareFarmButtonProps {
  name: string
}

export function ShareFarmButton({ name }: ShareFarmButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: name, url })
        return
      } catch {
        // fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // nothing to do
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-sm text-neutral-600 hover:text-forest transition-[background-color,color,border-color] duration-150 cursor-pointer"
        aria-label="Sdílet farmu"
      >
        <Share2 className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Sdílet</span>
      </button>

      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-medium whitespace-nowrap shadow-lg animate-in fade-in duration-200"
        >
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          Odkaz zkopírován
        </div>
      )}
    </div>
  )
}
