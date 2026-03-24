'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createRoot } from 'react-dom/client'
import { FarmMarker } from './FarmMarker'
import { MapControls } from './MapControls'
import {
  MAPBOX_TOKEN,
  MAP_STYLE,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DETAIL_ZOOM,
  farmToGeoJSON,
} from '@/lib/mapbox'
import { useFarmStore } from '@/store/farmStore'
import type { FarmMapMarker } from '@/types/farm'

mapboxgl.accessToken = MAPBOX_TOKEN

const SOURCE_ID = 'farms'
const CLUSTER_LAYER_ID = 'clusters'
const CLUSTER_COUNT_LAYER_ID = 'cluster-count'
const UNCLUSTERED_LAYER_ID = 'unclustered-point'

interface MapViewProps {
  markers: FarmMapMarker[]
}

export function MapView({ markers }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())

  const { selectedFarmId, hoveredFarmId, selectFarm, hoverFarm } = useFarmStore()

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left')

    map.on('load', () => {
      // Add GeoJSON source with clustering
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: farmToGeoJSON(markers),
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      })

      // Cluster circle layer
      map.addLayer({
        id: CLUSTER_LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#22C55E',
            10,
            '#15803D',
            50,
            '#14532D',
          ],
          'circle-radius': ['step', ['get', 'point_count'], 20, 10, 28, 50, 36],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.92,
        },
      })

      // Cluster count labels
      map.addLayer({
        id: CLUSTER_COUNT_LAYER_ID,
        type: 'symbol',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 13,
        },
        paint: {
          'text-color': '#ffffff',
        },
      })

      // Invisible unclustered points (actual markers rendered via DOM)
      map.addLayer({
        id: UNCLUSTERED_LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': 0,
          'circle-opacity': 0,
        },
      })

      // Add DOM markers for unclustered farms
      addDOMMarkers(map)

      // Cluster click → zoom in
      map.on('click', CLUSTER_LAYER_ID, (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [CLUSTER_LAYER_ID] })
        if (!features[0]) return
        const clusterId = features[0].properties?.cluster_id as number
        const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return
          const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number]
          map.easeTo({ center: coords, zoom })
        })
      })

      map.on('mouseenter', CLUSTER_LAYER_ID, () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', CLUSTER_LAYER_ID, () => {
        map.getCanvas().style.cursor = ''
      })
    })

    mapRef.current = map

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentMarkers = markersRef.current
      currentMarkers.forEach((m) => m.remove())
      currentMarkers.clear()
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-render markers when selection/hover changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps -- markersRef is a stable mutable map, not a React-managed node ref
    const currentMarkers = markersRef.current
    currentMarkers.forEach((marker, id) => {
      const el = marker.getElement()
      const farm = markers.find((m) => m.id === id)
      if (!farm) return
      const root = (el as HTMLElement & { _reactRoot?: ReturnType<typeof createRoot> })._reactRoot
      if (!root) return
      root.render(
        <FarmMarker
          {...farm}
          isSelected={selectedFarmId === id}
          isHovered={hoveredFarmId === id}
          onClick={selectFarm}
          onMouseEnter={hoverFarm}
          onMouseLeave={() => hoverFarm(null)}
        />,
      )
    })
  }, [selectedFarmId, hoveredFarmId, markers, selectFarm, hoverFarm])

  // Fly to selected farm
  useEffect(() => {
    if (!mapRef.current || !selectedFarmId) return
    const farm = markers.find((m) => m.id === selectedFarmId)
    if (!farm) return
    mapRef.current.flyTo({
      center: [farm.lng, farm.lat],
      zoom: DETAIL_ZOOM,
      duration: 800,
      essential: true,
    })
  }, [selectedFarmId, markers])

  const addDOMMarkers = useCallback(
    (map: mapboxgl.Map) => {
      markers.forEach((farm) => {
        const el = document.createElement('div') as HTMLElement & {
          _reactRoot?: ReturnType<typeof createRoot>
        }
        const root = createRoot(el)
        el._reactRoot = root
        root.render(
          <FarmMarker
            {...farm}
            isSelected={false}
            isHovered={false}
            onClick={selectFarm}
            onMouseEnter={hoverFarm}
            onMouseLeave={() => hoverFarm(null)}
          />,
        )

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([farm.lng, farm.lat])
          .addTo(map)

        markersRef.current.set(farm.id, marker)
      })
    },
    [markers, selectFarm, hoverFarm],
  )

  const handleZoomIn = useCallback(() => mapRef.current?.zoomIn(), [])
  const handleZoomOut = useCallback(() => mapRef.current?.zoomOut(), [])
  const handleLocate = useCallback(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      mapRef.current?.flyTo({
        center: [pos.coords.longitude, pos.coords.latitude],
        zoom: 12,
        duration: 1000,
      })
    })
  }, [])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocate}
      />
    </div>
  )
}
