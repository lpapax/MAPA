import type { FarmMapMarker } from '@/types/farm'

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12'

export const DEFAULT_CENTER: [number, number] = [15.4729, 49.8175] // Center of Czech Republic
export const DEFAULT_ZOOM = 7.2
export const DETAIL_ZOOM = 14
export const MIN_ZOOM = 6.5

// Czech Republic bounds — map cannot be panned or zoomed outside this box
export const CZ_BOUNDS: [[number, number], [number, number]] = [
  [11.5, 48.2], // SW corner
  [19.5, 51.5], // NE corner
]

export const CLUSTER_CONFIG = {
  cluster: true,
  clusterMaxZoom: 12,
  clusterRadius: 50,
} as const

export const CLUSTER_LAYER_PAINT = {
  'circle-color': [
    'step',
    ['get', 'point_count'],
    '#22C55E', // green-500 for small clusters
    10,
    '#15803D', // green-700 for medium
    50,
    '#14532D', // green-900 for large
  ],
  'circle-radius': ['step', ['get', 'point_count'], 20, 10, 28, 50, 36],
  'circle-stroke-width': 3,
  'circle-stroke-color': '#ffffff',
  'circle-opacity': 0.9,
} as const

export function farmToGeoJSON(
  markers: FarmMapMarker[],
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: markers.map((marker) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [marker.lng, marker.lat],
      },
      properties: {
        id: marker.id,
        slug: marker.slug,
        name: marker.name,
        categories: marker.categories.join(','),
        category: marker.categories[0] ?? 'ostatní',
        verified: marker.verified,
      },
    })),
  }
}

export function getBoundsForMarkers(
  markers: FarmMapMarker[],
): [[number, number], [number, number]] | null {
  if (markers.length === 0) return null

  const lngs = markers.map((m) => m.lng)
  const lats = markers.map((m) => m.lat)

  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ]
}
