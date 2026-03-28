'use client'

import { useRef } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const LINES = [
  {
    text: 'ČERSTVÉ',
    color: 'text-white',
    fromX: '-12vw',
    // scroll window: enters at 0.05, settles at 0.22, holds until 0.55, exits at 0.70
    enter: [0.05, 0.22] as [number, number],
    exit:  [0.55, 0.70] as [number, number],
  },
  {
    text: 'LOKÁLNÍ',
    color: 'text-primary-400',
    fromX: '12vw',
    enter: [0.20, 0.38] as [number, number],
    exit:  [0.62, 0.77] as [number, number],
  },
  {
    text: 'POCTIVÉ',
    color: 'text-earth-400',
    fromX: '-12vw',
    enter: [0.38, 0.56] as [number, number],
    exit:  [0.75, 0.92] as [number, number],
  },
]

// ─── KineticLine ─────────────────────────────────────────────────────────────

function KineticLine({
  text,
  color,
  fromX,
  enter,
  exit: exitRange,
  progress,
  reducedMotion,
}: (typeof LINES)[0] & {
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reducedMotion: boolean | null
}) {
  const x = useTransform(
    progress,
    [enter[0], enter[1], exitRange[0], exitRange[1]],
    reducedMotion ? [0, 0, 0, 0] : [fromX, '0vw', '0vw', fromX === '-12vw' ? '12vw' : '-12vw'],
  )
  const opacity = useTransform(
    progress,
    [enter[0], enter[1], exitRange[0], exitRange[1]],
    [0, 1, 1, 0],
  )

  return (
    <motion.span
      style={reducedMotion ? {} : { x, opacity }}
      className={`block font-heading font-black leading-none select-none ${color}`}
    >
      {text}
    </motion.span>
  )
}

// ─── KineticTextSection ───────────────────────────────────────────────────────

export function KineticTextSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // CTA fades in near the end
  const ctaOpacity = useTransform(
    scrollYProgress,
    reducedMotion ? [0, 0] : [0.70, 0.88],
    [0, 1],
  )
  const ctaY = useTransform(
    scrollYProgress,
    reducedMotion ? [0, 0] : [0.70, 0.88],
    reducedMotion ? [0, 0] : [32, 0],
  )

  return (
    // Container is tall — its scroll distance drives the animations
    <div
      ref={containerRef}
      style={{ height: reducedMotion ? 'auto' : '350vh' }}
      className="relative bg-forest"
      aria-label="Čerstvé, lokální, poctivé z farmy"
    >
      {/* Sticky inner — stays in view while container scrolls */}
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6"
        aria-hidden="true"
      >
        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_40%,rgba(0,0,0,0.55)_100%)]"
          aria-hidden="true"
        />

        {/* Kinetic words */}
        <div className="relative z-10 text-center text-[15vw] sm:text-[13vw] lg:text-[11vw] xl:text-[9.5vw] tracking-tighter -mt-4">
          {LINES.map((line) => (
            <KineticLine
              key={line.text}
              {...line}
              progress={scrollYProgress}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          style={reducedMotion ? {} : { opacity: ctaOpacity, y: ctaY }}
          className="relative z-10 mt-8 text-white/50 text-sm sm:text-base tracking-widest uppercase font-medium text-center"
        >
          Bez prostředníků · Přímo od farmáře
        </motion.p>

        {/* CTA button */}
        <motion.div
          style={reducedMotion ? {} : { opacity: ctaOpacity, y: ctaY }}
          className="relative z-10 mt-6"
        >
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors duration-300 group"
          >
            Najít farmu
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
