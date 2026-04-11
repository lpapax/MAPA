import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Přihlásit se – Mapa Farem',
  description: 'Přihlaste se magickým odkazem a synchronizujte oblíbené farmy a recenze.',
}

export default function PrihlasitPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[100dvh] bg-surface flex items-center justify-center px-4 pt-8">
        <LoginForm />
      </main>
    </>
  )
}
