import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Uses CSS vars injected by next/font/google in layout.tsx
        sans:    ['var(--font-body)', 'Karla', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Spectral', 'Georgia', 'serif'],
      },
      colors: {
        // ── Primary — deep forest green ──────────────────
        primary: {
          DEFAULT: '#4a8c3f',
          foreground: '#ffffff',
          50:  '#f3faf0',
          100: '#e0f4d7',
          200: '#c3e8b2',
          300: '#97d47e',
          400: '#6bba52',
          500: '#4a8c3f',
          600: '#3a7031',
          700: '#2d6b23',
          800: '#255a1c',
          900: '#1a4214',
        },
        // ── Earth / warm amber ────────────────────────────
        earth: {
          DEFAULT: '#c4914d',
          50:  '#fdf8f1',
          100: '#f5ede0',
          200: '#ead4b5',
          300: '#dab888',
          400: '#c4914d',
          500: '#b07838',
          600: '#96612c',
          700: '#8b5e2a',
          800: '#6d4820',
          900: '#4f3318',
        },
        // ── CTA / info ────────────────────────────────────
        cta: {
          DEFAULT: '#0891B2',
          dark:  '#0E7490',
          light: '#06B6D4',
          50:    '#ECFEFF',
          100:   '#CFFAFE',
        },
        // ── Warm neutral (replaces cold Tailwind gray) ────
        neutral: {
          50:  '#fafaf8',
          100: '#f0ede8',
          200: '#e5e0d8',
          300: '#d4cfc8',
          400: '#a09890',
          500: '#8a857e',
          600: '#6b6560',
          700: '#4a4540',
          800: '#2e2924',
          900: '#1c1917',
        },
        // ── Named surface tokens ──────────────────────────
        surface: '#faf7f0',
        cream:   '#ffffff',
        forest:  '#1a4214',
        // ── shadcn/ui CSS vars ────────────────────────────
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
      },
      borderRadius: {
        sm:     '4px',
        DEFAULT: '8px',
        md:     '8px',
        lg:     '12px',
        xl:     '16px',
        '2xl':  '20px',
        '3xl':  '28px',
        '4xl':  '36px',
        full:   '9999px',
      },
      boxShadow: {
        sm:           '0 1px 2px rgba(28,25,23,0.06)',
        DEFAULT:      '0 2px 8px rgba(28,25,23,0.08)',
        md:           '0 4px 12px rgba(28,25,23,0.08)',
        lg:           '0 8px 24px rgba(28,25,23,0.10)',
        xl:           '0 16px 40px rgba(28,25,23,0.12)',
        card:         '0 1px 4px rgba(28,25,23,0.06), 0 2px 8px rgba(28,25,23,0.06)',
        'card-hover': '0 4px 16px rgba(28,25,23,0.10), 0 8px 24px rgba(28,25,23,0.08)',
        'card-earth': '0 4px 16px rgba(196,145,77,0.12)',
        glass:        '0 4px 16px rgba(28,25,23,0.06)',
        navbar:       '0 1px 0 0 #e3ddd4',
        marker:       '0 2px 8px rgba(28,25,23,0.20)',
        glow:         '0 0 0 3px rgba(74,140,63,0.15)',
        'glow-earth': '0 0 0 3px rgba(196,145,77,0.15)',
      },
      backgroundImage: {
        'hero-overlay':
          'linear-gradient(to right, rgba(13,30,10,0.88) 0%, rgba(26,66,20,0.60) 55%, rgba(26,66,20,0.10) 100%)',
        seasonal:
          'linear-gradient(135deg, #1a4214 0%, #4a8c3f 60%, #8b5e2a 100%)',
        newsletter:
          'linear-gradient(135deg, #255a1c 0%, #4a8c3f 100%)',
        'warm-section':
          'linear-gradient(180deg, #ffffff 0%, #faf7f0 100%)',
        'hero-map':
          'linear-gradient(155deg, #0d2909 0%, #1a4214 35%, #2d6b23 100%)',
        'earth-soft':
          'linear-gradient(135deg, #fdf8f1 0%, #f5ede0 100%)',
      },
      fontSize: {
        '5xl': ['3rem',    { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.05' }],
        '7xl': ['4.5rem',  { lineHeight: '1.0' }],
        '8xl': ['6rem',    { lineHeight: '0.95' }],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
