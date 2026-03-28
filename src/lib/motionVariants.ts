import type { Transition, Variants } from 'framer-motion'

// Spring presets
export const SPRING_GENTLE: Transition = { type: 'spring', stiffness: 200, damping: 24 }
export const SPRING_BOUNCY: Transition = { type: 'spring', stiffness: 300, damping: 20 }
export const SPRING_STIFF: Transition = { type: 'spring', stiffness: 400, damping: 30 }

// Variant presets
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
}

// Direction-aware tab slide (pass direction via `custom`)
export const tabSlide = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0 }),
}
