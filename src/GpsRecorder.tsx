import { useEffect, useRef, useState } from 'react'

export type RoutePoint = {
  latitude: number
  longitude: number
  timestamp: number
  accuracy: number
}

type GpsRecorderProps = {
  onRouteFinished: (
    route: RoutePoint[],
    durationSeconds: number,
    distanceMiles: number,
  ) => void
}

const calculateDistanceMetres = (
  firstPoint: RoutePoint,
  secondPoint: RoutePoint,
) => {
  const earthRadiusMetres = 6371000

  const latitudeOne =
    (firstPoint.latitude * Math.PI) / 180
  const latitudeTwo =
    (secondPoint.latitude * Math.PI) / 180

  const latitudeDifference =
    ((secondPoint.latitude - firstPoint.latitude) *
      Math.PI) /
    180

  const longitudeDifference =
    ((secondPoint.longitude - firstPoint.longitude) *
      Math.PI) /
    180

  const calculation =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitudeOne) *
      Math.cos(latitudeTwo) *
      Math.sin(longitudeDifference / 2) ** 2

  const angularDistance =
    2 *
    Math.atan2(
      Math.sqrt(calculation),
      Math.sqrt(1 - calculation),
    )

  return earthRadiusMetres * angularDistance
}

const formatElapsedTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}

function GpsRecorder({
  onRouteFinished,
}: GpsRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [route, setRoute] = useState<RoutePoint[]>([])
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [distanceMiles, setDistanceMiles] = useState(0)
  const [gpsMessage, setGpsMessage] = useState(
    'GPS recording has not started.',
  )

  const watchIdRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(
          watchIdRef.current,
        )
      }

      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [])

  const beginRecording = () => {
    if (!navigator.geolocation) {
      setGpsMessage(
        'GPS location is not supported by this device or browser.',
      )
      return
    }

    setRoute([])
    setElapsedSeconds(0)
    setDistanceMiles(0)
    setGpsMessage('Waiting for an accurate GPS position…')

    startTimeRef.current = Date.now()
    setIsRecording(true)

    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current === null) return

      setElapsedSeconds(
        Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        ),
      )
    }, 1000)

    watchIdRef.current =
      navigator.geolocation.watchPosition(
        (position) => {
          const newPoint: RoutePoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
            accuracy: position.coords.accuracy,
          }

          setRoute((currentRoute) => {
            const previousPoint =
              currentRoute[currentRoute.length - 1]

            if (previousPoint) {
              const distanceMetres =
                calculateDistanceMetres(
                  previousPoint,
                  newPoint,
                )

              /*
               * Ignore tiny movements likely caused by GPS drift,
               * and large inaccurate jumps.
               */
              if (
                distanceMetres >= 4 &&
                distanceMetres <= 500
              ) {
                setDistanceMiles(
                  (currentDistance) =>
                    currentDistance +
                    distanceMetres / 1609.344,
                )
              }
            }

            return [...currentRoute, newPoint]
          })

          setGpsMessage(
            `GPS active · accuracy approximately ${Math.round(
              position.coords.accuracy,
            )} metres`,
          )
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setGpsMessage(
              'Location permission was denied. Allow location access in your browser settings.',
            )
          } else if (
            error.code === error.POSITION_UNAVAILABLE
          ) {
            setGpsMessage(
              'Your location is currently unavailable.',
            )
          } else {
            setGpsMessage(
              'GPS timed out. Move somewhere with a clearer view of the sky and try again.',
            )
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 3000,
          timeout: 15000,
        },
      )
  }

  const finishRecording = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(
        watchIdRef.current,
      )
      watchIdRef.current = null
    }

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsRecording(false)
    setGpsMessage(
      route.length > 0
        ? 'Route recording finished.'
        : 'Recording stopped without receiving a GPS position.',
    )

    onRouteFinished(
      route,
      elapsedSeconds,
      distanceMiles,
    )
  }

  const discardRecording = () => {
    const confirmed = window.confirm(
      'Discard this GPS recording?',
    )

    if (!confirmed) return

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(
        watchIdRef.current,
      )
      watchIdRef.current = null
    }

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsRecording(false)
    setRoute([])
    setElapsedSeconds(0)
    setDistanceMiles(0)
    setGpsMessage('GPS recording discarded.')
  }

  return (
    <div className="lesson-card spaced-card gps-card">
      <div className="gps-heading">
        <div>
          <p className="section-label">Optional</p>
          <h3>GPS lesson recording</h3>
        </div>

        <span
          className={
            isRecording
              ? 'gps-status recording'
              : 'gps-status'
          }
        >
          {isRecording ? 'Recording' : 'Stopped'}
        </span>
      </div>

      <p>
        Start this before moving. Do not interact with the app
        while supervising a moving vehicle.
      </p>

      <div className="gps-stat-grid">
        <div>
          <strong>{formatElapsedTime(elapsedSeconds)}</strong>
          <span>elapsed</span>
        </div>

        <div>
          <strong>{distanceMiles.toFixed(2)}</strong>
          <span>miles</span>
        </div>

        <div>
          <strong>{route.length}</strong>
          <span>GPS points</span>
        </div>
      </div>

      <p className="gps-message">{gpsMessage}</p>

      {!isRecording ? (
        <button
          type="button"
          className="start-button"
          onClick={beginRecording}
        >
          <span>
            <strong>Start GPS recording</strong>
            <small>
              Record the lesson route and duration
            </small>
          </span>

          <span>●</span>
        </button>
      ) : (
        <>
          <button
            type="button"
            className="start-button gps-stop-button"
            onClick={finishRecording}
          >
            <span>
              <strong>Finish recording</strong>
              <small>
                Keep this route with the lesson
              </small>
            </span>

            <span>■</span>
          </button>

          <button
            type="button"
            className="text-button gps-discard-button"
            onClick={discardRecording}
          >
            Discard recording
          </button>
        </>
      )}
    </div>
  )
}

export default GpsRecorder