'use client'

interface ClusterMarkerProps {
  count: number
  onClick: () => void
}

export function ClusterMarker({ count, onClick }: ClusterMarkerProps) {
  const size = count < 10 ? 36 : count < 50 ? 44 : 52
  const bg = count < 10 ? '#22C55E' : count < 50 ? '#15803D' : '#14532D'

  return (
    <button
      onClick={onClick}
      aria-label={`Skupina ${count} farem`}
      className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full transition-transform duration-150 hover:scale-110"
      style={{ width: size, height: size }}
    >
      <div
        className="flex items-center justify-center rounded-full border-3 border-white shadow-marker font-semibold text-white"
        style={{
          width: size,
          height: size,
          backgroundColor: bg,
          borderWidth: 3,
          fontSize: count < 10 ? 13 : 12,
        }}
      >
        {count}
      </div>
    </button>
  )
}
