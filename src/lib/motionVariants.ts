import type { Variants } from 'framer-motion'

// ── Spring presets ────────────────────────────────────────────
export const SPRING_GENTLE  = { type: 'spring', stiffness: 200, damping: 30 } as const
export const SPRING_BOUNCY  = { type: 'spring', stiffness: 400, damping: 20 } as const
export const SPRING_STIFF   = { type: 'spring', stiffness: 600, damping: 35 } as const

// ── Entry variants ────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: SPRING_GENTLE },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}

export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: SPRING_GENTLE },
}

export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: SPRING_GENTLE },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.90 },
  visible: { opacity: 1, scale: 1, transition: SPRING_GENTLE },
}

// ── Stagger containers ────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export const staggerContainerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
}

// ── Tab / slide transitions ───────────────────────────────────
export const tabSlide: Variants = {
  hidden:  { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0,  transition: SPRING_GENTLE },
  exit:    { opacity: 0, x: -10, transition: { duration: 0.15 } },
}
