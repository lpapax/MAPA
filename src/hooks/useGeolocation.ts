'use client'

import { useState, useEffect } from 'react'

interface GeolocationState {
  lat: number | null
  lng: number | null
  error: string | null
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({ lat: null, lng: null, error: null })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ lat: null, lng: null, error: 'not supported' })
      return
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, error: null }),
      () => setState({ lat: null, lng: null, error: 'denied' }),
      { enableHighAccuracy: false, timeout: 8000 },
    )

    return () => navigator.geolocation.clearWatch(id)
  }, [])

  return state
}
