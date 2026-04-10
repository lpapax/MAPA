'use client'

import { motion, type TargetAndTransition } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  /** Delay in milliseconds before the animation starts */
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
}

const INITIAL: Record<string, TargetAndTransition> = {
  up:    { opacity: 0, y: 20 },
  left:  { opacity: 0, x: -20 },
  right: { opacity: 0, x: 20 },
  none:  { opacity: 0 },
}

const ANIMATE: Record<string, TargetAndTransition> = {
  up:    { opacity: 1, y: 0 },
  left:  { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  none:  { opacity: 1 },
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={INITIAL[direction]}
      whileInView={ANIMATE[direction]}
      viewport={{ once: true, margin: '-80px 0px' }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 30,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  )
}
