'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Illustration */}
        <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" aria-hidden="true" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-forest mb-3">
          Něco se pokazilo
        </h1>
        <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Na serveru nastala neočekávaná chyba. Zkuste stránku načíst znovu nebo se vraťte domů.
          Pokud problém přetrvává, kontaktujte nás na{' '}
          <a href="mailto:info@mapafarem.cz" className="text-primary-600 hover:underline">
            info@mapafarem.cz
          </a>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Zkusit znovu
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-forest font-semibold text-sm transition-colors duration-200 cursor-pointer"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Domovská stránka
          </Link>
        </div>
      </div>
    </div>
  )
}
