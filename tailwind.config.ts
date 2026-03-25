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
        sans: ['Raleway', 'system-ui', 'sans-serif'],
        heading: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        // Brand palette
        primary: {
          DEFAULT: '#059669',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        cta: {
          DEFAULT: '#0891B2',
          dark: '#0E7490',
          light: '#06B6D4',
          50: '#ECFEFF',
          100: '#CFFAFE',
        },
        surface: '#ECFDF5',
        forest: '#064E3B',
        // shadcn/ui CSS vars
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
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(5,150,105,0.14), 0 8px 32px rgba(5,150,105,0.08)',
        glass: '0 8px 32px rgba(6,78,59,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        navbar: '0 4px 24px rgba(6,78,59,0.10)',
        marker: '0 2px 8px rgba(0,0,0,0.22)',
        glow: '0 0 0 4px rgba(5,150,105,0.15)',
      },
      backgroundImage: {
        'hero-map':
          'radial-gradient(ellipse at 20% 80%, #a7f3d0 0%, transparent 45%), radial-gradient(ellipse at 80% 20%, #6ee7b7 0%, transparent 45%), linear-gradient(160deg, #064e3b 0%, #059669 45%, #34d399 100%)',
        'hero-overlay':
          'linear-gradient(to right, rgba(6,78,59,0.82) 0%, rgba(6,78,59,0.50) 60%, rgba(6,78,59,0.10) 100%)',
        'seasonal':
          'linear-gradient(135deg, #064e3b 0%, #059669 40%, #d97706 80%, #f59e0b 100%)',
        'newsletter':
          'linear-gradient(135deg, #047857 0%, #059669 50%, #0891b2 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
