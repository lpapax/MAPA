'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBasket, Printer, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useBedynka } from '@/hooks/useBedynka'

export function BedynkaClient() {
  const { items, removeItem, updateQuantity, clearBedynka, totalItems } = useBedynka()
  const [copied, setCopied] = useState(false)

  // Group by farm
  const byFarm = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.farmSlug
    return { ...acc, [key]: [...(acc[key] ?? []), item] }
  }, {})

  const handleCopy = () => {
    const lines: string[] = ['Moje bedýnka – Mapa Farem\n']
    Object.entries(byFarm).forEach(([, farmItems]) => {
      lines.push(`=== ${farmItems[0].farmName} ===`)
      farmItems.forEach((item) => {
        lines.push(`  ${item.productName} × ${item.quantity}  (${item.price} Kč/${item.unit})`)
      })
      lines.push('')
    })
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handlePrint = () => window.print()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
          <ShoppingBasket className="w-8 h-8 text-primary-300" aria-hidden="true" />
        </div>
        <h2 className="font-heading font-bold text-forest text-xl mb-2">Bedýnka je prázdná</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
          Přidejte produkty tlačítkem &bdquo;+ Přidat do bedýnky&ldquo; na stránce farmy.
        </p>
        <Link
          href="/mapa"
          className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
        >
          Procházet farmy →
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">
          {totalItems} {totalItems === 1 ? 'položka' : totalItems < 5 ? 'položky' : 'položek'}
          {' '}ze {Object.keys(byFarm).length} {Object.keys(byFarm).length === 1 ? 'farmy' : 'farem'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Zkopírováno' : 'Kopírovat'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Tisk
          </button>
          <button
            onClick={clearBedynka}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vyprázdnit
          </button>
        </div>
      </div>

      {/* Items grouped by farm */}
      <div className="space-y-6">
        {Object.entries(byFarm).map(([farmSlug, farmItems]) => (
          <div key={farmSlug} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Farm header */}
            <div className="flex items-center justify-between px-5 py-3 bg-primary-50 border-b border-primary-100">
              <h2 className="font-heading font-bold text-forest text-sm">{farmItems[0].farmName}</h2>
              <Link
                href={`/farmy/${farmSlug}`}
                className="text-xs text-primary-600 hover:underline"
              >
                Detail farmy →
              </Link>
            </div>

            {/* Products */}
            <div className="divide-y divide-gray-50">
              {farmItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-forest truncate">{item.productName}</p>
                    <p className="text-xs text-gray-400">{item.price} Kč/{item.unit}</p>
                  </div>
                  {/* Quantity */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-30 transition-colors cursor-pointer"
                      aria-label="Snížit množství"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium text-forest w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      aria-label="Zvýšit množství"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Price */}
                  <span className="text-sm font-semibold text-primary-600 flex-shrink-0 w-20 text-right">
                    {(parseFloat(item.price) * item.quantity).toFixed(0)} Kč
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
                    aria-label={`Odstranit ${item.productName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
