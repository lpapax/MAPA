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
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        // ── Brand palette — muted forest green ──────────
        primary: {
          DEFAULT: '#4a8c3f',
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
        // ── Earth / warm amber secondary ─────────────────
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
          dark: '#0E7490',
          light: '#06B6D4',
          50: '#ECFEFF',
          100: '#CFFAFE',
        },
        // ── Warm neutral scale (replaces cool Tailwind gray) ─
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
        surface: '#fafaf8',
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
        sm:   '6px',
        DEFAULT: '10px',
        md:   '10px',
        lg:   '14px',
        xl:   '20px',
        '2xl': '28px',
        '3xl': '36px',
        '4xl': '48px',
        full: '9999px',
      },
      boxShadow: {
        // Warm shadows (neutral brown tint, not cold black/green)
        sm:  '0 1px 3px rgba(28,25,23,0.08)',
        DEFAULT: '0 4px 12px rgba(28,25,23,0.10)',
        md:  '0 4px 12px rgba(28,25,23,0.10)',
        lg:  '0 8px 24px rgba(28,25,23,0.12)',
        xl:  '0 16px 40px rgba(28,25,23,0.14)',
        // Card tokens
        card:        '0 1px 3px rgba(28,25,23,0.06), 0 4px 14px rgba(28,25,23,0.08)',
        'card-hover': '0 6px 20px rgba(74,140,63,0.16), 0 12px 36px rgba(74,140,63,0.10)',
        'card-earth': '0 4px 20px rgba(196,145,77,0.14), 0 8px 32px rgba(196,145,77,0.08)',
        glass:       '0 8px 32px rgba(28,25,23,0.08), 0 1px 2px rgba(28,25,23,0.04)',
        navbar:      '0 4px 24px rgba(28,25,23,0.10)',
        marker:      '0 2px 8px rgba(28,25,23,0.22)',
        glow:        '0 0 0 4px rgba(74,140,63,0.15)',
        'glow-earth': '0 0 0 4px rgba(196,145,77,0.15)',
      },
      backgroundImage: {
        'hero-map':
          'radial-gradient(ellipse at 12% 88%, #97d47e 0%, transparent 48%), radial-gradient(ellipse at 82% 12%, #6bba52 0%, transparent 48%), linear-gradient(155deg, #0d2909 0%, #1a4214 28%, #255a1c 58%, #2d6b23 100%)',
        'hero-overlay':
          'linear-gradient(to right, rgba(13,41,9,0.90) 0%, rgba(26,66,20,0.68) 52%, rgba(26,66,20,0.12) 100%)',
        seasonal:
          'linear-gradient(135deg, #1a4214 0%, #4a8c3f 40%, #c4914d 80%, #b07838 100%)',
        newsletter:
          'linear-gradient(135deg, #2d6b23 0%, #4a8c3f 50%, #0891b2 100%)',
        'warm-section':
          'linear-gradient(180deg, #ffffff 0%, #fafaf8 100%)',
        'earth-soft':
          'linear-gradient(135deg, #fdf8f1 0%, #f5ede0 50%, #e0f4d7 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
