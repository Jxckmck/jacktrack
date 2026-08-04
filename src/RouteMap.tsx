import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { RoutePoint } from './GpsRecorder'

type RouteMapProps = {
  route: RoutePoint[]
}

function RouteMap({ route }: RouteMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  const [isOnline, setIsOnline] = useState(
    navigator.onLine,
  )
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setMapError(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (
      !isOnline ||
      mapError ||
      route.length === 0 ||
      !mapElementRef.current
    ) {
      return
    }

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const coordinates = route.map(
      (point) =>
        [point.latitude, point.longitude] as L.LatLngTuple,
    )

    const map = L.map(mapElementRef.current, {
      zoomControl: true,
      attributionControl: true,
    })

    mapRef.current = map

    const tileLayer = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      },
    )

    tileLayer.on('tileerror', () => {
      setMapError(true)
    })

    tileLayer.addTo(map)

    const routeLine = L.polyline(coordinates, {
      color: '#2563eb',
      weight: 5,
      opacity: 0.9,
      lineJoin: 'round',
      lineCap: 'round',
    }).addTo(map)

    const startPoint = coordinates[0]
    const finishPoint = coordinates[coordinates.length - 1]

    L.circleMarker(startPoint, {
      radius: 7,
      color: '#ffffff',
      weight: 3,
      fillColor: '#16a34a',
      fillOpacity: 1,
    })
      .bindTooltip('Start')
      .addTo(map)

    L.circleMarker(finishPoint, {
      radius: 7,
      color: '#ffffff',
      weight: 3,
      fillColor: '#dc2626',
      fillOpacity: 1,
    })
      .bindTooltip('Finish')
      .addTo(map)

    if (coordinates.length === 1) {
      map.setView(startPoint, 16)
    } else {
      map.fitBounds(routeLine.getBounds(), {
        padding: [28, 28],
      })
    }

    window.setTimeout(() => {
      map.invalidateSize()
    }, 150)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [route, isOnline, mapError])

  if (route.length === 0) {
    return null
  }

  if (!isOnline) {
    return (
      <div className="map-unavailable">
        <strong>Internet connection required</strong>

        <p>
          The recorded route is saved offline, but an internet
          connection is needed to load the map.
        </p>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="map-unavailable">
        <strong>Map could not be loaded</strong>

        <p>
          The route remains saved. Check the internet connection and
          reopen this lesson to try again.
        </p>
      </div>
    )
  }

  return (
    <div className="route-map-wrapper">
      <div
        ref={mapElementRef}
        className="route-map"
        aria-label="Recorded lesson route map"
      />
    </div>
  )
}

export default RouteMap