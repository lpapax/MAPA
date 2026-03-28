export default function Loading() {
  return (
    <div className="min-h-screen bg-surface pt-20 pb-20">
      {/* Hero skeleton */}
      <div className="h-56 bg-gradient-to-br from-forest/20 via-primary-800/20 to-teal-700/20 animate-pulse mb-12" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title skeleton */}
        <div className="h-6 bg-neutral-200 rounded-xl animate-pulse w-1/3 mb-3" />
        <div className="h-4 bg-neutral-100 rounded-xl animate-pulse w-1/2 mb-10" />

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-card"
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-neutral-100 rounded-lg animate-pulse w-3/4" />
                <div className="h-3 bg-neutral-100 rounded-lg animate-pulse w-1/2" />
                <div className="h-3 bg-neutral-100 rounded-lg animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
