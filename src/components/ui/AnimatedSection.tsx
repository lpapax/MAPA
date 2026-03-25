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
  0: 'delay-0',
  100: 'delay-100',
  200: 'delay-200',
  300: 'delay-300',
  400: 'delay-400',
  500: 'delay-500',
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const { ref, isVisible } = useIntersectionObserver()

  const hiddenClass = {
    up: 'opacity-0 translate-y-8',
    left: 'opacity-0 -translate-x-8',
    right: 'opacity-0 translate-x-8',
    none: 'opacity-0',
  }[direction]

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        delayClass[delay],
        isVisible ? 'opacity-100 translate-x-0 translate-y-0' : hiddenClass,
        className,
      )}
    >
      {children}
    </div>
  )
}
