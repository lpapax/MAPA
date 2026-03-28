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

  // Subtle fade-up only — no dramatic slide-ins
  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-500 ease-out',
        delayClass[delay],
        isVisible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
