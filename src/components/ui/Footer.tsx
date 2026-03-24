import Link from 'next/link'

const NAV_COL = [
  { href: '/', label: 'Farmy' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/blog', label: 'Blog' },
  { href: '/o-projektu', label: 'O projektu' },
  { href: '/kontakt', label: 'Kontakt' },
]

const FARMER_COL = [
  { href: '/pridat-farmu', label: 'Přidat farmu' },
  { href: '/pro-farmary', label: 'Pro farmáře' },
  { href: '/podminky', label: 'Podmínky užití' },
  { href: '/certifikace', label: 'Bio certifikace' },
  { href: '/pomoc', label: 'Nápověda' },
]

export function Footer() {
  return (
    <footer className="bg-forest text-white/80 pt-14 pb-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <path
                    d="M5 23C5 23 7 12 14 9C21 6 24 9 24 9C24 9 22 20 14 23C10 25 5 23 5 23Z"
                    fill="white"
                    fillOpacity="0.95"
                  />
                  <path d="M5 23L14 13" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-heading font-bold text-white text-base">Mapa Farem</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Propojujeme zákazníky s místními farmáři po celé České republice. Čerstvé, lokální,
              poctivé.
            </p>
            <div className="flex gap-3 mt-5">
              <SocialLink
                href="https://facebook.com"
                label="Facebook"
                icon={
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                }
              />
              <SocialLink
                href="https://instagram.com"
                label="Instagram"
                icon={
                  <>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </>
                }
              />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Navigace
            </h3>
            <ul className="space-y-2.5">
              {NAV_COL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro farmáře */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Pro farmáře
            </h3>
            <ul className="space-y-2.5">
              {FARMER_COL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Kontakt
            </h3>
            <address className="not-italic space-y-3 text-sm text-white/60">
              <p>
                <span className="text-white/40 block text-xs mb-0.5">E-mail</span>
                <a
                  href="mailto:info@mapafarem.cz"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  info@mapafarem.cz
                </a>
              </p>
              <p>
                <span className="text-white/40 block text-xs mb-0.5">Telefon</span>
                <a
                  href="tel:+420800123456"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  +420 800 123 456
                </a>
              </p>
              <p>
                <span className="text-white/40 block text-xs mb-0.5">Sídlo</span>
                Praha, Česká republika
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Mapa Farem. Všechna práva vyhrazena.</p>
          <div className="flex gap-5">
            <Link href="/soukromi" className="hover:text-white/70 transition-colors cursor-pointer">
              Ochrana soukromí
            </Link>
            <Link href="/cookies" className="hover:text-white/70 transition-colors cursor-pointer">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200 cursor-pointer"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {icon}
      </svg>
    </a>
  )
}
