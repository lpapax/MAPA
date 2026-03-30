'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  /** Animation duration in seconds */
  duration?: number
}

export function AnimatedCounter({ target, suffix = '', duration = 1.6 }: AnimatedCounterProps) {
  const count   = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString('cs-CZ') + suffix)
  const ref     = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      count.set(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        animate(count, target, {
          duration,
          ease: [0.16, 1, 0.3, 1], // expo-out
        })
      },
      { threshold: 0.5 },
    )

    const el = ref.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, count])

  return <motion.span ref={ref}>{rounded}</motion.span>
}
