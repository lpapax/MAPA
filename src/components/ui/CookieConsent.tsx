'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Check, ChevronRight } from 'lucide-react'
import { useCookieConsent } from '@/hooks/useCookieConsent'
import { cn } from '@/lib/utils'

export function CookieConsent() {
  const { showBanner, accept, reject } = useCookieConsent()

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          role="dialog"
          aria-label="Nastavení cookies"
          aria-modal="false"
          className="fixed bottom-0 left-0 right-0 z-[200] px-4 pb-4 sm:bottom-6 sm:left-auto sm:right-6 sm:px-0 sm:pb-0 sm:max-w-sm md:max-w-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-start gap-3 px-5 pt-5 pb-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="w-4 h-4 text-primary-600" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-forest text-base leading-tight mb-1">
                  Cookies & soukromí
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Používáme analytické cookies abychom zlepšili váš zážitek.{' '}
                  <Link
                    href="/cookies"
                    className="text-primary-600 hover:underline font-medium"
                  >
                    Více info
                  </Link>
                </p>
              </div>
            </div>

            {/* Cookie types */}
            <div className="px-5 pb-4 space-y-2">
              <CookieRow
                label="Nezbytné"
                description="Přihlašování, bezpečnost"
                locked
              />
              <CookieRow
                label="Analytické"
                description="Google Analytics — jak web používáte"
              />
              <CookieRow
                label="Marketingové"
                description="Meta Pixel, Google Ads — měření reklam"
              />
            </div>

            {/* Actions */}
            <div className={cn(
              'flex flex-col sm:flex-row gap-2 px-5 pb-5',
            )}>
              <button
                onClick={reject}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl',
                  'border border-neutral-200 text-neutral-600 text-xs font-semibold',
                  'hover:border-neutral-300 hover:bg-neutral-50 transition-colors cursor-pointer',
                )}
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                Odmítnout volitelné
              </button>
              <button
                onClick={accept}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl',
                  'bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold',
                  'transition-colors cursor-pointer shadow-sm',
                )}
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                Přijmout vše
              </button>
            </div>

            {/* Footer link */}
            <div className="px-5 pb-4 -mt-1">
              <Link
                href="/soukromi"
                className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <ChevronRight className="w-3 h-3" aria-hidden="true" />
                Zásady ochrany soukromí
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CookieRow({
  label,
  description,
  locked = false,
}: {
  label: string
  description: string
  locked?: boolean
}) {
  return (
    <div className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-neutral-50">
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-neutral-700">{label}</span>
        <span className="text-[11px] text-neutral-400 ml-1.5">{description}</span>
      </div>
      {locked ? (
        <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full flex-shrink-0">
          Vždy
        </span>
      ) : (
        <span className="text-[10px] font-medium text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full flex-shrink-0">
          Volitelné
        </span>
      )}
    </div>
  )
}
