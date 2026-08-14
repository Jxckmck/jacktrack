import {
  useEffect,
  useRef,
  useState,
} from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { RoutePoint } from './GpsRecorder'

export type ReflectionMarker = {
  id: number
  latitude: number
  longitude: number
  note: string
  createdAt: number
}

type RouteMapProps = {
  route: RoutePoint[]
  markers?: ReflectionMarker[]
  isAddingMarker?: boolean
  onAddMarker?: (
    latitude: number,
    longitude: number,
  ) => void
}

const ROUTE_GAP_SECONDS = 20

const buildRouteSegments = (
  route: RoutePoint[],
) => {
  const segments: RoutePoint[][] = []

  let currentSegment: RoutePoint[] = []

  route.forEach((point, index) => {
    const previousPoint =
      index > 0
        ? route[index - 1]
        : null

    const timeGapSeconds =
      previousPoint
        ? Math.max(
            0,
            (point.timestamp -
              previousPoint.timestamp) /
              1000,
          )
        : 0

    const shouldStartNewSegment =
      index > 0 &&
      (point.segmentBreak === true ||
        timeGapSeconds >
          ROUTE_GAP_SECONDS)

    if (
      shouldStartNewSegment &&
      currentSegment.length > 0
    ) {
      segments.push(currentSegment)
      currentSegment = []
    }

    currentSegment.push(point)
  })

  if (currentSegment.length > 0) {
    segments.push(currentSegment)
  }

  return segments
}

function RouteMap({
  route,
  markers = [],
  isAddingMarker = false,
  onAddMarker,
}: RouteMapProps) {
  const mapElementRef =
    useRef<HTMLDivElement | null>(null)

  const mapRef =
    useRef<L.Map | null>(null)

  const [isOnline, setIsOnline] =
    useState(navigator.onLine)

  const [mapError, setMapError] =
    useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setMapError(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener(
      'online',
      handleOnline,
    )

    window.addEventListener(
      'offline',
      handleOffline,
    )

    return () => {
      window.removeEventListener(
        'online',
        handleOnline,
      )

      window.removeEventListener(
        'offline',
        handleOffline,
      )
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

    const map = L.map(
      mapElementRef.current,
      {
        zoomControl: true,
        attributionControl: true,
      },
    )

    mapRef.current = map

    const tileLayer = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      },
    )

    tileLayer.on(
      'tileerror',
      () => {
        setMapError(true)
      },
    )

    tileLayer.addTo(map)

    const routeSegments =
      buildRouteSegments(route)

    const allCoordinates =
      route.map(
        (point) =>
          [
            point.latitude,
            point.longitude,
          ] as L.LatLngTuple,
      )

    routeSegments.forEach(
      (segment) => {
        const segmentCoordinates =
          segment.map(
            (point) =>
              [
                point.latitude,
                point.longitude,
              ] as L.LatLngTuple,
          )

        if (
          segmentCoordinates.length >= 2
        ) {
          L.polyline(
            segmentCoordinates,
            {
              color: '#2563eb',
              weight: 5,
              opacity: 0.9,
              lineJoin: 'round',
              lineCap: 'round',
            },
          ).addTo(map)
        } else if (
          segmentCoordinates.length === 1
        ) {
          L.circleMarker(
            segmentCoordinates[0],
            {
              radius: 3,
              color: '#2563eb',
              weight: 1,
              fillColor: '#2563eb',
              fillOpacity: 0.9,
            },
          ).addTo(map)
        }
      },
    )

    const startPoint =
      allCoordinates[0]

    const finishPoint =
      allCoordinates[
        allCoordinates.length - 1
      ]

    L.circleMarker(
      startPoint,
      {
        radius: 7,
        color: '#ffffff',
        weight: 3,
        fillColor: '#16a34a',
        fillOpacity: 1,
      },
    )
      .bindTooltip('Start')
      .addTo(map)

    L.circleMarker(
      finishPoint,
      {
        radius: 7,
        color: '#ffffff',
        weight: 3,
        fillColor: '#dc2626',
        fillOpacity: 1,
      },
    )
      .bindTooltip('Finish')
      .addTo(map)

    markers.forEach(
      (marker, index) => {
        L.circleMarker(
          [
            marker.latitude,
            marker.longitude,
          ],
          {
            radius: 8,
            color: '#ffffff',
            weight: 3,
            fillColor: '#7c3aed',
            fillOpacity: 1,
          },
        )
          .bindPopup(
            `<strong>Reflection ${
              index + 1
            }</strong><br>${marker.note}`,
          )
          .addTo(map)
      },
    )

    if (
      isAddingMarker &&
      onAddMarker
    ) {
      map.getContainer().style.cursor =
        'crosshair'

      map.on(
        'click',
        (
          event: L.LeafletMouseEvent,
        ) => {
          onAddMarker(
            event.latlng.lat,
            event.latlng.lng,
          )
        },
      )
    }

    if (
      allCoordinates.length === 1
    ) {
      map.setView(
        startPoint,
        16,
      )
    } else {
      const routeBounds =
        L.latLngBounds(
          allCoordinates,
        )

      map.fitBounds(
        routeBounds,
        {
          padding: [28, 28],
        },
      )
    }

    window.setTimeout(() => {
      map.invalidateSize()
    }, 150)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [
    route,
    markers,
    isOnline,
    mapError,
    isAddingMarker,
    onAddMarker,
  ])

  if (route.length === 0) {
    return null
  }

  if (!isOnline) {
    return (
      <div className="map-unavailable">
        <strong>
          Internet connection required
        </strong>

        <p>
          The route and reflection
          markers are saved offline,
          but an internet connection is
          needed to load the map.
        </p>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="map-unavailable">
        <strong>
          Map could not be loaded
        </strong>

        <p>
          The recorded route remains
          saved. Check the internet
          connection and reopen this
          lesson.
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