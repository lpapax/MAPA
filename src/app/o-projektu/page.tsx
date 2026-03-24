export const metadata = {
  title: 'O projektu – Mapa Farem',
}

export default function OProjektuPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center px-4">
        <h1 className="text-3xl font-bold text-green-900 mb-4">O projektu</h1>
        <p className="text-green-700 max-w-xl mx-auto">
          Mapa Farem propojuje zákazníky s lokálními farmáři z celé České republiky.
          Nakupujte čerstvé, lokální a poctivé produkty přímo od zdroje.
        </p>
      </div>
    </main>
  )
}
