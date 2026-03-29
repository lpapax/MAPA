'use client'

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: 0 | 100 | 200 | 300 | 400 | 500
  direction?: 'up' | 'left' | 'right' | 'none'
}

const delayClass: Record<number, string> = {
  0:   '',
  100: 'delay-75',
  200: 'delay-100',
  300: 'delay-150',
  400: 'delay-200',
  500: 'delay-300',
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction: _direction = 'up',
}: AnimatedSectionProps) {
  const { ref, isVisible } = useIntersectionObserver()

  // Respect prefers-reduced-motion — skip animation entirely
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      ref={ref}
      className={cn(
        prefersReduced ? '' : 'transition-opacity duration-500 ease-out',
        prefersReduced ? '' : delayClass[delay],
        prefersReduced || isVisible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
