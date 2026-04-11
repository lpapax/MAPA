'use client'

import { cn } from '@/lib/utils'

/**
 * Sprite sheet: 5 columns × 3 rows (Gemini_Generated_Image_.png)
 * Positions [col, row] — adjust here if order is wrong.
 *
 * Visual read (left→right, top→bottom):
 *   [0,0] broccoli      → zelenina
 *   [1,0] milk carton   → mléko
 *   [2,0] round green   → sýry   ← swap if wrong
 *   [3,0] mushrooms     → ostatní ← swap if wrong
 *   [4,0] veg cluster   → (unused slot)
 *   [0,1] bee/honey     → med
 *   [1,1] egg carton    → vejce
 *   [2,1] grapes        → víno
 *   [3,1] fruit basket  → ovoce
 *   [4,1] herbs         → byliny
 *   [0,2] fish          → ryby
 *   [1,2] roast chicken → maso
 *   [2,2] bread         → chléb
 *   [3,2] (unused)
 *   [4,2] (unused)
 */
const SPRITE: Record<string, [col: number, row: number]> = {
  zelenina: [0, 0],
  mléko:    [1, 0],
  sýry:     [2, 0],
  ostatní:  [3, 0],
  med:      [0, 1],
  vejce:    [1, 1],
  víno:     [2, 1],
  ovoce:    [3, 1],
  byliny:   [4, 1],
  ryby:     [0, 2],
  maso:     [1, 2],
  chléb:    [2, 2],
}

interface CategoryIconProps {
  category: string
  size?: number
  className?: string
}

export function CategoryIcon({ category, size = 20, className }: CategoryIconProps) {
  const pos = SPRITE[category]
  if (!pos) return null

  const [col, row] = pos
  // 5-col grid: x = col * (100 / (5-1)) = col * 25
  // 3-row grid: y = row * (100 / (3-1)) = row * 50
  const x = col * 25
  const y = row * 50

  return (
    <span
      className={cn('inline-block flex-shrink-0', className)}
      style={{
        width: size,
        height: size,
        backgroundImage: `url('/Gemini_Generated_Image_.png')`,
        backgroundSize: '500% 300%',
        backgroundPosition: `${x}% ${y}%`,
        backgroundRepeat: 'no-repeat',
      }}
      aria-hidden="true"
    />
  )
}
