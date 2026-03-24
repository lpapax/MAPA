import type { FarmCategory } from '@/types/farm'

// ──────────────────────────────────────────────
// Featured farms for homepage
// ──────────────────────────────────────────────

export interface MockFarm {
  id: string
  slug: string
  name: string
  farmerName: string
  farmerInitials: string
  farmerColor: string        // Tailwind bg class for avatar
  coverGradient: string      // Tailwind gradient for cover placeholder
  distance: string
  rating: number
  reviewCount: number
  kraj: string
  categories: FarmCategory[]
  spotlight?: boolean
  quote?: string
}

export const FEATURED_FARMS: MockFarm[] = [
  {
    id: 'f1',
    slug: 'ekofarma-dvorak',
    name: 'Ekofarma Dvořák',
    farmerName: 'Jan Dvořák',
    farmerInitials: 'JD',
    farmerColor: 'bg-emerald-500',
    coverGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    distance: '3 km',
    rating: 4.9,
    reviewCount: 128,
    kraj: 'Jihočeský',
    categories: ['zelenina', 'ovoce', 'vejce'],
  },
  {
    id: 'f2',
    slug: 'farma-bila-hora',
    name: 'Farma Bílá hora',
    farmerName: 'Marie Nováková',
    farmerInitials: 'MN',
    farmerColor: 'bg-amber-500',
    coverGradient: 'from-amber-300 via-orange-400 to-red-500',
    distance: '12 km',
    rating: 4.7,
    reviewCount: 84,
    kraj: 'Středočeský',
    categories: ['maso', 'mléko'],
    spotlight: true,
    quote:
      'Naše krávy pasou na přirozených loukách bez přídavku hormonů. Věříme, že spokojené zvíře dává nejlepší mléko.',
  },
  {
    id: 'f3',
    slug: 'vceli-zahrada',
    name: 'Včelí zahrada',
    farmerName: 'Pavel Krejčí',
    farmerInitials: 'PK',
    farmerColor: 'bg-yellow-500',
    coverGradient: 'from-yellow-300 via-amber-400 to-orange-500',
    distance: '5 km',
    rating: 5.0,
    reviewCount: 61,
    kraj: 'Jihomoravský',
    categories: ['med', 'byliny'],
  },
  {
    id: 'f4',
    slug: 'rodinná-farma-kopecky',
    name: 'Rodinná farma Kopecký',
    farmerName: 'Tomáš Kopecký',
    farmerInitials: 'TK',
    farmerColor: 'bg-green-600',
    coverGradient: 'from-green-400 via-emerald-500 to-teal-600',
    distance: '8 km',
    rating: 4.8,
    reviewCount: 93,
    kraj: 'Vysočina',
    categories: ['zelenina', 'mléko', 'vejce'],
  },
  {
    id: 'f5',
    slug: 'ovocne-sady-novotny',
    name: 'Ovocné sady Novotný',
    farmerName: 'Eva Novotná',
    farmerInitials: 'EN',
    farmerColor: 'bg-rose-500',
    coverGradient: 'from-rose-300 via-pink-400 to-red-400',
    distance: '22 km',
    rating: 4.6,
    reviewCount: 47,
    kraj: 'Plzeňský',
    categories: ['ovoce', 'víno'],
  },
]

// ──────────────────────────────────────────────
// Testimonials
// ──────────────────────────────────────────────

export interface Testimonial {
  id: string
  name: string
  city: string
  rating: number
  quote: string
  initials: string
  color: string
  since: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Jana Kováříková',
    city: 'Praha',
    rating: 5,
    quote:
      'Konečně vím, odkud pochází jídlo, které dávám svým dětem. Bedýnka ze Statku Dvořák přijde každý pátek a zelenina je naprosto čerstvá. Doporučuji každé rodině!',
    initials: 'JK',
    color: 'bg-emerald-500',
    since: 'zákazník od 2023',
  },
  {
    id: 't2',
    name: 'Petr Machala',
    city: 'Brno',
    rating: 5,
    quote:
      'Sehnat kvalitní lokální maso bylo vždy problém. Díky Mapě Farem jsem našel farmu 15 km od Brna a teď nakupuji přímo u farmáře. Chuť je nesrovnatelná s obchodem.',
    initials: 'PM',
    color: 'bg-amber-500',
    since: 'zákazník od 2022',
  },
  {
    id: 't3',
    name: 'Markéta Svobodová',
    city: 'Olomouc',
    rating: 5,
    quote:
      'Miluju med z Včelí zahrady. Pan Krejčí mi vždy poradí, který druh je vhodný pro co. Takový osobní přístup v supermarketu nenajdete. Mapa Farem je super nápad!',
    initials: 'MS',
    color: 'bg-rose-500',
    since: 'zákazník od 2024',
  },
]

// ──────────────────────────────────────────────
// Blog articles
// ──────────────────────────────────────────────

export interface BlogArticle {
  id: string
  title: string
  category: string
  categoryColor: string
  readTime: string
  excerpt: string
  coverGradient: string
  slug: string
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'b1',
    title: 'Proč kupovat lokální potraviny? 7 důvodů, které vás přesvědčí',
    category: 'Životní styl',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    readTime: '5 min čtení',
    excerpt:
      'Lokální potraviny nejsou jen trend. Přinášejí zdravotní výhody, podporují lokální ekonomiku a snižují uhlíkovou stopu.',
    coverGradient: 'from-emerald-400 to-teal-500',
    slug: 'proc-kupovat-lokalni-potraviny',
  },
  {
    id: 'b2',
    title: 'Bedýnka zeleniny: kompletní průvodce pro začátečníky',
    category: 'Průvodce',
    categoryColor: 'bg-blue-100 text-blue-700',
    readTime: '7 min čtení',
    excerpt:
      'Jak vybrat správnou bedýnku, co v ní očekávat a jak zpracovat méně známou zeleninu. Vše, co potřebujete vědět.',
    coverGradient: 'from-green-400 to-emerald-600',
    slug: 'bedynka-zeleniny-pruvodce',
  },
  {
    id: 'b3',
    title: 'Jak poznám bio certifikaci? Průvodce ekologickým zemědělstvím',
    category: 'Bio & Eko',
    categoryColor: 'bg-amber-100 text-amber-700',
    readTime: '4 min čtení',
    excerpt:
      'Co skutečně znamená označení BIO, jak ho ověřit a proč se vyplatí hledat certifikované produkty od lokálních farmářů.',
    coverGradient: 'from-lime-400 to-green-500',
    slug: 'jak-poznam-bio-certifikaci',
  },
]

// ──────────────────────────────────────────────
// Seasonal products
// ──────────────────────────────────────────────

export const SEASONAL_PRODUCTS = [
  'Jahody',
  'Chřest',
  'Špenát',
  'Ředkvičky',
  'Hrášek',
  'Salát',
  'Pažitka',
  'Rebarbora',
  'Medvědí česnek',
]
