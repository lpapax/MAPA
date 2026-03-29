'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  duration?: number
}

export function AnimatedCounter({ target, suffix = '', duration = 1600 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    // Respect user's motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setCount(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const steps = 60
        const interval = duration / steps
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(Math.round(current))
          }
        }, interval)
      },
      { threshold: 0.5 },
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString('cs-CZ')}
      {suffix}
    </span>
  )
}
