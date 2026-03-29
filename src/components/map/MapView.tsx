'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapControls } from './MapControls'
import { MapLegend } from './MapLegend'
import { CATEGORY_META } from '@/lib/farms'
import type { FarmCategory } from '@/types/farm'
import {
  MAPBOX_TOKEN,
  MAP_STYLE,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DETAIL_ZOOM,
  MIN_ZOOM,
  CZ_BOUNDS,
  farmToGeoJSON,
} from '@/lib/mapbox'
import { useFarmStore } from '@/store/farmStore'
import type { FarmMapMarker } from '@/types/farm'

if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN
}

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
  const selectedIdRef = useRef<string | null>(null)
  const hoveredIdRef = useRef<string | null>(null)
  const popupRef = useRef<mapboxgl.Popup | null>(null)

  const { selectedFarmId, selectFarm, hoverFarm } = useFarmStore()

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: CZ_BOUNDS,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left')

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: 'farm-popup',
    })
    popupRef.current = popup

    map.on('load', () => {
      // GeoJSON source with clustering — promoteId lets setFeatureState use the 'id' property
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: farmToGeoJSON(markers),
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
        promoteId: 'id',
      })

      // Cluster circles
      map.addLayer({
        id: CLUSTER_LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step', ['get', 'point_count'],
            '#4a8c3f', 10, '#2d6b23', 50, '#1a4214',
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
        paint: { 'text-color': '#ffffff' },
      })

      // Individual farm dots — native GL circles, state-driven styling + category colors
      map.addLayer({
        id: UNCLUSTERED_LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 13,
            ['boolean', ['feature-state', 'hovered'], false], 11,
            8,
          ],
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], '#064E3B',
            [
              'match', ['get', 'category'],
              'zelenina', '#4a8c3f',
              'ovoce',    '#e05a6e',
              'maso',     '#bf5b3d',
              'mléko',    '#4a90c4',
              'vejce',    '#c8963e',
              'med',      '#c8a23e',
              'byliny',   '#6ba832',
              'chléb',    '#a07850',
              'sýry',     '#d4a855',
              'víno',     '#7b3d8c',
              'ryby',     '#3d7fa0',
              '#6b7280',
            ],
          ],
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 3,
            ['boolean', ['feature-state', 'hovered'], false], 2,
            1.5,
          ],
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 1,
        },
      })

      // Cluster click → expand
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

      // Farm click → select
      map.on('click', UNCLUSTERED_LAYER_ID, (e) => {
        const feature = e.features?.[0]
        if (!feature) return
        const id = feature.properties?.id as string | undefined
        if (id) selectFarm(id)
      })

      // Farm hover → highlight + popup
      map.on('mousemove', UNCLUSTERED_LAYER_ID, (e) => {
        const feature = e.features?.[0]
        if (!feature?.geometry) return

        const id = feature.properties?.id as string | undefined
        const name = feature.properties?.name as string | undefined
        if (!id) return

        if (hoveredIdRef.current && hoveredIdRef.current !== id) {
          map.setFeatureState({ source: SOURCE_ID, id: hoveredIdRef.current }, { hovered: false })
        }
        hoveredIdRef.current = id
        map.setFeatureState({ source: SOURCE_ID, id }, { hovered: true })
        hoverFarm(id)
        map.getCanvas().style.cursor = 'pointer'

        if (name) {
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number]
          const cat = (feature.properties?.category ?? 'ostatní') as FarmCategory
          const emoji = CATEGORY_META[cat]?.emoji ?? '🏪'
          popup
            .setLngLat(coords)
            .setHTML(`<div class="farm-popup-inner"><span class="farm-popup-emoji">${emoji}</span>${name}</div>`)
            .addTo(map)
        }
      })

      map.on('mouseleave', UNCLUSTERED_LAYER_ID, () => {
        if (hoveredIdRef.current) {
          map.setFeatureState({ source: SOURCE_ID, id: hoveredIdRef.current }, { hovered: false })
          hoveredIdRef.current = null
        }
        hoverFarm(null)
        map.getCanvas().style.cursor = ''
        popup.remove()
      })

      map.on('mouseenter', CLUSTER_LAYER_ID, () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', CLUSTER_LAYER_ID, () => { map.getCanvas().style.cursor = '' })
    })

    mapRef.current = map

    return () => {
      popup.remove()
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync selected farm → feature state
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getSource(SOURCE_ID)) return

    if (selectedIdRef.current) {
      map.setFeatureState({ source: SOURCE_ID, id: selectedIdRef.current }, { selected: false })
    }
    selectedIdRef.current = selectedFarmId
    if (selectedFarmId) {
      map.setFeatureState({ source: SOURCE_ID, id: selectedFarmId }, { selected: true })
    }
  }, [selectedFarmId])

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

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-green-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <p className="text-red-600 font-semibold text-lg mb-2">Mapa není dostupná</p>
          <p className="text-neutral-500 text-sm">
            Chybí Mapbox API token. Přidejte{' '}
            <code className="bg-neutral-100 px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> do prostředí Vercel.
          </p>
          <p className="text-neutral-400 text-xs mt-2">
            DEBUG: token length = {(process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '').length}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocate}
      />
      <MapLegend />
    </div>
  )
}
