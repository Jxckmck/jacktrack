import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export type RoutePoint = {
  latitude: number
  longitude: number
  timestamp: number
  accuracy: number
}

export type GpsRecordingResult = {
  route: RoutePoint[]
  durationSeconds: number
  distanceMiles: number
}

export type GpsRecorderHandle = {
  finishRecording: () => GpsRecordingResult
  isRecording: () => boolean
}

type GpsRecorderProps = {
  onRouteFinished?: (
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

const GpsRecorder = forwardRef<
  GpsRecorderHandle,
  GpsRecorderProps
>(function GpsRecorder(
  { onRouteFinished },
  ref,
) {
  const [isRecording, setIsRecording] =
    useState(false)
  const [route, setRoute] = useState<
    RoutePoint[]
  >([])
  const [elapsedSeconds, setElapsedSeconds] =
    useState(0)
  const [distanceMiles, setDistanceMiles] =
    useState(0)
  const [gpsMessage, setGpsMessage] = useState(
    'Start the lesson when you are parked and ready to begin.',
  )

  const watchIdRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const isRecordingRef = useRef(false)
  const routeRef = useRef<RoutePoint[]>([])
  const distanceMilesRef = useRef(0)

  const clearTracking = () => {
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
  }

  const stopWithoutSaving = () => {
    clearTracking()
    isRecordingRef.current = false
    setIsRecording(false)
  }

  useEffect(() => {
    return () => {
      clearTracking()
    }
  }, [])

  const beginRecording = () => {
    if (isRecordingRef.current) return

    if (!navigator.geolocation) {
      setGpsMessage(
        'GPS location is not supported by this device or browser.',
      )
      return
    }

    routeRef.current = []
    distanceMilesRef.current = 0
    setRoute([])
    setElapsedSeconds(0)
    setDistanceMiles(0)
    setGpsMessage(
      'Waiting for an accurate GPS position…',
    )

    startTimeRef.current = Date.now()
    isRecordingRef.current = true
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

          const previousPoint =
            routeRef.current[
              routeRef.current.length - 1
            ]

          if (previousPoint) {
            const distanceMetres =
              calculateDistanceMetres(
                previousPoint,
                newPoint,
              )

            if (
              distanceMetres >= 4 &&
              distanceMetres <= 500
            ) {
              distanceMilesRef.current +=
                distanceMetres / 1609.344

              setDistanceMiles(
                distanceMilesRef.current,
              )
            }
          }

          routeRef.current = [
            ...routeRef.current,
            newPoint,
          ]
          setRoute(routeRef.current)

          setGpsMessage(
            `GPS active · accuracy approximately ${Math.round(
              position.coords.accuracy,
            )} metres`,
          )
        },
        (error) => {
          stopWithoutSaving()

          if (error.code === error.PERMISSION_DENIED) {
            setGpsMessage(
              'Location permission was denied. Allow location access in your browser settings, then try again.',
            )
          } else if (
            error.code === error.POSITION_UNAVAILABLE
          ) {
            setGpsMessage(
              'Your location is currently unavailable. Move somewhere with a clearer view of the sky and try again.',
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

  const finishRecording = (): GpsRecordingResult => {
    const durationSeconds =
      startTimeRef.current === null
        ? 0
        : Math.max(
            0,
            Math.floor(
              (Date.now() - startTimeRef.current) /
                1000,
            ),
          )

    const result: GpsRecordingResult = {
      route: [...routeRef.current],
      durationSeconds,
      distanceMiles: distanceMilesRef.current,
    }

    clearTracking()
    isRecordingRef.current = false
    startTimeRef.current = null
    setIsRecording(false)
    setElapsedSeconds(durationSeconds)
    setGpsMessage(
      result.route.length > 0
        ? 'GPS recording finished and attached to the lesson.'
        : 'Recording stopped without receiving a GPS position.',
    )

    onRouteFinished?.(
      result.route,
      result.durationSeconds,
      result.distanceMiles,
    )

    return result
  }

  useImperativeHandle(
    ref,
    () => ({
      finishRecording,
      isRecording: () => isRecordingRef.current,
    }),
  )

  const discardRecording = () => {
    const confirmed = window.confirm(
      'Discard this GPS recording?',
    )

    if (!confirmed) return

    stopWithoutSaving()
    startTimeRef.current = null
    routeRef.current = []
    distanceMilesRef.current = 0
    setRoute([])
    setElapsedSeconds(0)
    setDistanceMiles(0)
    setGpsMessage(
      'GPS recording discarded. Start the lesson again when ready.',
    )
  }

  return (
    <div className="lesson-card spaced-card gps-card">
      <div className="gps-heading">
        <div>
          <p className="section-label">Required</p>
          <h3>GPS lesson recording</h3>
        </div>

        <span
          className={
            isRecording
              ? 'gps-status recording'
              : 'gps-status'
          }
        >
          {isRecording ? 'Recording' : 'Not started'}
        </span>
      </div>

      <p>
        Start this while safely parked. GPS will stop
        automatically when you finish and save the lesson.
        Do not interact with the app while supervising a
        moving vehicle.
      </p>

      <div className="gps-stat-grid">
        <div>
          <strong>
            {formatElapsedTime(elapsedSeconds)}
          </strong>
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
            <strong>Start lesson and GPS</strong>
            <small>
              Begin recording the route and duration
            </small>
          </span>

          <span>●</span>
        </button>
      ) : (
        <>
          <div className="lesson-card skills-summary">
            <h3>Lesson in progress</h3>
            <p>
              When safely parked at the end, complete the
              reflection and press Finish and save lesson.
            </p>
          </div>

          <button
            type="button"
            className="text-button gps-discard-button"
            onClick={discardRecording}
          >
            Discard lesson recording
          </button>
        </>
      )}
    </div>
  )
})

export default GpsRecorder
