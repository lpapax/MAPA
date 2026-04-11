import Link from 'next/link'
import type { Metadata } from 'next'
import { MapPin, ArrowLeft, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Stránka nenalezena – Mapa Farem',
  description: 'Tato stránka neexistuje. Vraťte se na domovskou stránku a najděte farmu ve svém okolí.',
}

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-surface flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-primary-50 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-primary-300" aria-hidden="true" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-earth-100 flex items-center justify-center font-heading font-bold text-xl text-earth-600">
            ?
          </div>
        </div>

        <h1 className="font-heading text-5xl font-bold text-forest mb-3">404</h1>
        <h2 className="font-heading text-xl font-semibold text-forest mb-4">
          Tahle farma se ztratila v poli
        </h2>
        <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Stránka, kterou hledáte, neexistuje nebo byla přesunuta. Zkuste se vrátit domů
          nebo hledat farmy přímo na mapě.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Zpět na domovskou
          </Link>
          <Link
            href="/mapa"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-primary-200 bg-white hover:bg-primary-50 text-primary-700 font-semibold text-sm transition-colors duration-200 cursor-pointer"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Hledat farmy
          </Link>
        </div>
      </div>
    </div>
  )
}
