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
  segmentBreak?: boolean
}

export type GpsCoverageSummary = {
  isComplete: boolean
  interruptedSeconds: number
  longestGapSeconds: number
  gapCount: number
  coveragePercent: number
  wasBackgrounded: boolean
}

export type GpsRecordingResult = {
  route: RoutePoint[]
  durationSeconds: number
  distanceMiles: number
  coverage: GpsCoverageSummary
}

export type GpsRecorderHandle = {
  startRecording: () => boolean
  finishRecording: () => GpsRecordingResult
  discardRecording: () => void
  isRecording: () => boolean
}

type GpsRecorderProps = {
  onRouteFinished?: (
    route: RoutePoint[],
    durationSeconds: number,
    distanceMiles: number,
    coverage: GpsCoverageSummary,
  ) => void
  onRecordingInterrupted?: () => void
}

type RecordingState =
  | 'idle'
  | 'recording'
  | 'finished'

const MAX_ACCEPTABLE_ACCURACY_METRES = 80
const ROUTE_GAP_SECONDS = 20
const MIN_MOVEMENT_METRES = 3
const MAX_REALISTIC_SPEED_METRES_PER_SECOND = 55

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
    ((secondPoint.latitude -
      firstPoint.latitude) *
      Math.PI) /
    180

  const longitudeDifference =
    ((secondPoint.longitude -
      firstPoint.longitude) *
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

const formatElapsedTime = (
  seconds: number,
) => {
  const hours = Math.floor(seconds / 3600)

  const minutes = Math.floor(
    (seconds % 3600) / 60,
  )

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
  {
    onRouteFinished,
    onRecordingInterrupted,
  },
  ref,
) {
  const [recordingState, setRecordingState] =
    useState<RecordingState>('idle')

  const [route, setRoute] = useState<
    RoutePoint[]
  >([])

  const [
    elapsedSeconds,
    setElapsedSeconds,
  ] = useState(0)

  const [
    distanceMiles,
    setDistanceMiles,
  ] = useState(0)

  const [gpsMessage, setGpsMessage] =
    useState(
      'GPS will start automatically when you press Start lesson.',
    )

  const [
    recordingWarning,
    setRecordingWarning,
  ] = useState('')

  const watchIdRef =
    useRef<number | null>(null)

  const timerRef =
    useRef<number | null>(null)

  const startTimeRef =
    useRef<number | null>(null)

  const isRecordingRef =
    useRef(false)

  const routeRef =
    useRef<RoutePoint[]>([])

  const distanceMilesRef =
    useRef(0)

  const forceNextSegmentBreakRef =
    useRef(false)

  const lastReliableFixAtRef =
    useRef<number | null>(null)

  const interruptedSecondsRef =
    useRef(0)

  const longestGapSecondsRef =
    useRef(0)

  const gapCountRef = useRef(0)

  const wasBackgroundedRef =
    useRef(false)

  const clearTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(
        watchIdRef.current,
      )

      watchIdRef.current = null
    }

    if (timerRef.current !== null) {
      window.clearInterval(
        timerRef.current,
      )

      timerRef.current = null
    }
  }

  const stopAfterGpsError = () => {
    clearTracking()

    isRecordingRef.current = false
    startTimeRef.current = null

    setRecordingState('idle')

    onRecordingInterrupted?.()
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isRecordingRef.current) {
        return
      }

      if (document.hidden) {
        forceNextSegmentBreakRef.current =
          true
        wasBackgroundedRef.current = true

        setRecordingWarning(
          'JackTrack was backgrounded or the screen was locked. iPhone may pause GPS while this happens.',
        )
      } else {
        forceNextSegmentBreakRef.current =
          true

        setGpsMessage(
          'JackTrack is active again. GPS tracking will continue from the next reliable position.',
        )
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    )

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      )

      clearTracking()
    }
  }, [])

  const startRecording = () => {
    if (isRecordingRef.current) {
      setRecordingWarning(
        'A lesson is already being recorded. Finish or discard the current lesson before starting another.',
      )

      return false
    }

    if (!navigator.geolocation) {
      setGpsMessage(
        'GPS location is not supported by this device or browser.',
      )

      return false
    }

    routeRef.current = []
    distanceMilesRef.current = 0
    forceNextSegmentBreakRef.current = false
    lastReliableFixAtRef.current = null
    interruptedSecondsRef.current = 0
    longestGapSecondsRef.current = 0
    gapCountRef.current = 0
    wasBackgroundedRef.current = false

    setRoute([])
    setElapsedSeconds(0)
    setDistanceMiles(0)
    setRecordingWarning('')
    setGpsMessage(
      'Waiting for a reliable GPS position…',
    )

    startTimeRef.current = Date.now()
    isRecordingRef.current = true

    setRecordingState('recording')

    timerRef.current = window.setInterval(
      () => {
        if (startTimeRef.current === null) {
          return
        }

        setElapsedSeconds(
          Math.floor(
            (Date.now() -
              startTimeRef.current) /
              1000,
          ),
        )
      },
      1000,
    )

    watchIdRef.current =
      navigator.geolocation.watchPosition(
        (position) => {
          if (
            position.coords.accuracy >
            MAX_ACCEPTABLE_ACCURACY_METRES
          ) {
            setGpsMessage(
              `Waiting for better GPS accuracy · currently approximately ${Math.round(
                position.coords.accuracy,
              )} metres`,
            )

            return
          }

          const reliableFixReceivedAt = Date.now()

          const previousPoint =
            routeRef.current[
              routeRef.current.length - 1
            ]

          let shouldBreakSegment =
            forceNextSegmentBreakRef.current

          let distanceMetres = 0

          const previousReliableFixAt =
            lastReliableFixAtRef.current

          const timeSinceReliableFixSeconds =
            previousReliableFixAt === null
              ? startTimeRef.current === null
                ? 0
                : Math.max(
                    0,
                    (reliableFixReceivedAt -
                      startTimeRef.current) /
                      1000,
                  )
              : Math.max(
                  0,
                  (reliableFixReceivedAt -
                    previousReliableFixAt) /
                    1000,
                )

          if (
            timeSinceReliableFixSeconds >
            ROUTE_GAP_SECONDS
          ) {
            shouldBreakSegment = Boolean(
              previousPoint,
            )

            interruptedSecondsRef.current +=
              timeSinceReliableFixSeconds
            gapCountRef.current += 1
            longestGapSecondsRef.current =
              Math.max(
                longestGapSecondsRef.current,
                timeSinceReliableFixSeconds,
              )

            setRecordingWarning(
              `GPS tracking was interrupted for about ${formatElapsedTime(
                Math.round(
                  timeSinceReliableFixSeconds,
                ),
              )}. JackTrack will keep the route sections separate rather than drawing an inaccurate straight line.`,
            )
          }

          lastReliableFixAtRef.current =
            reliableFixReceivedAt

          if (previousPoint) {
            const routePointTimeDifferenceSeconds =
              Math.max(
                0,
                (position.timestamp -
                  previousPoint.timestamp) /
                  1000,
              )

            distanceMetres =
              calculateDistanceMetres(
                previousPoint,
                {
                  latitude:
                    position.coords.latitude,
                  longitude:
                    position.coords.longitude,
                  timestamp:
                    position.timestamp,
                  accuracy:
                    position.coords.accuracy,
                },
              )

            if (
              !shouldBreakSegment &&
              routePointTimeDifferenceSeconds > 0
            ) {
              const calculatedSpeed =
                distanceMetres /
                routePointTimeDifferenceSeconds

              if (
                calculatedSpeed >
                MAX_REALISTIC_SPEED_METRES_PER_SECOND
              ) {
                shouldBreakSegment = true

                setRecordingWarning(
                  'JackTrack rejected an unrealistic GPS jump and started a new route section.',
                )
              }
            }
          }

          const newPoint: RoutePoint = {
            latitude:
              position.coords.latitude,
            longitude:
              position.coords.longitude,
            timestamp:
              position.timestamp,
            accuracy:
              position.coords.accuracy,
            segmentBreak: Boolean(
              previousPoint &&
                shouldBreakSegment,
            ),
          }

          if (
            previousPoint &&
            !shouldBreakSegment &&
            distanceMetres <
              MIN_MOVEMENT_METRES
          ) {
            setGpsMessage(
              `GPS active · accuracy approximately ${Math.round(
                position.coords.accuracy,
              )} metres`,
            )

            return
          }

          if (
            previousPoint &&
            !shouldBreakSegment
          ) {
            distanceMilesRef.current +=
              distanceMetres / 1609.344

            setDistanceMiles(
              distanceMilesRef.current,
            )
          }

          routeRef.current = [
            ...routeRef.current,
            newPoint,
          ]

          setRoute(routeRef.current)

          forceNextSegmentBreakRef.current =
            false

          setGpsMessage(
            `GPS active · accuracy approximately ${Math.round(
              position.coords.accuracy,
            )} metres`,
          )
        },
        (error) => {
          stopAfterGpsError()

          if (
            error.code ===
            error.PERMISSION_DENIED
          ) {
            setGpsMessage(
              'Location permission was denied. Allow location access in your browser settings, then press Start lesson again.',
            )
          } else if (
            error.code ===
            error.POSITION_UNAVAILABLE
          ) {
            setGpsMessage(
              'Your location is currently unavailable. Move somewhere with a clearer view of the sky, then press Start lesson again.',
            )
          } else {
            setGpsMessage(
              'GPS timed out. Move somewhere with a clearer view of the sky, then press Start lesson again.',
            )
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 15000,
        },
      )

    return true
  }

  const finishRecording =
    (): GpsRecordingResult => {
      const durationSeconds =
        startTimeRef.current === null
          ? elapsedSeconds
          : Math.max(
              0,
              Math.floor(
                (Date.now() -
                  startTimeRef.current) /
                  1000,
              ),
            )

      let interruptedSeconds =
        interruptedSecondsRef.current
      let longestGapSeconds =
        longestGapSecondsRef.current
      let gapCount = gapCountRef.current

      const now = Date.now()

      if (routeRef.current.length === 0) {
        interruptedSeconds = durationSeconds
        longestGapSeconds = durationSeconds
        gapCount = durationSeconds > 0 ? 1 : 0
      } else if (
        lastReliableFixAtRef.current !== null
      ) {
        const trailingGapSeconds = Math.max(
          0,
          (now -
            lastReliableFixAtRef.current) /
            1000,
        )

        if (
          trailingGapSeconds >
          ROUTE_GAP_SECONDS
        ) {
          interruptedSeconds +=
            trailingGapSeconds
          longestGapSeconds = Math.max(
            longestGapSeconds,
            trailingGapSeconds,
          )
          gapCount += 1
        }
      }

      const clampedInterruptedSeconds =
        Math.min(
          durationSeconds,
          Math.max(
            0,
            Math.round(interruptedSeconds),
          ),
        )

      const coveragePercent =
        durationSeconds <= 0
          ? routeRef.current.length > 0
            ? 100
            : 0
          : Math.max(
              0,
              Math.min(
                100,
                Math.round(
                  ((durationSeconds -
                    clampedInterruptedSeconds) /
                    durationSeconds) *
                    100,
                ),
              ),
            )

      const coverage: GpsCoverageSummary = {
        isComplete:
          routeRef.current.length > 0 &&
          gapCount === 0,
        interruptedSeconds:
          clampedInterruptedSeconds,
        longestGapSeconds: Math.round(
          longestGapSeconds,
        ),
        gapCount,
        coveragePercent,
        wasBackgrounded:
          wasBackgroundedRef.current,
      }

      const result: GpsRecordingResult = {
        route: [...routeRef.current],
        durationSeconds,
        distanceMiles:
          distanceMilesRef.current,
        coverage,
      }

      clearTracking()

      isRecordingRef.current = false
      startTimeRef.current = null

      setRecordingState('finished')
      setElapsedSeconds(durationSeconds)

      setGpsMessage(
        result.route.length > 0
          ? 'Lesson finished. GPS route is ready to save with the lesson.'
          : 'Lesson finished, but no reliable GPS position was received.',
      )

      onRouteFinished?.(
        result.route,
        result.durationSeconds,
        result.distanceMiles,
        result.coverage,
      )

      return result
    }

  const discardRecording = () => {
    clearTracking()

    isRecordingRef.current = false
    startTimeRef.current = null
    routeRef.current = []
    distanceMilesRef.current = 0
    forceNextSegmentBreakRef.current = false
    lastReliableFixAtRef.current = null
    interruptedSecondsRef.current = 0
    longestGapSecondsRef.current = 0
    gapCountRef.current = 0
    wasBackgroundedRef.current = false

    setRecordingState('idle')
    setRoute([])
    setElapsedSeconds(0)
    setDistanceMiles(0)
    setRecordingWarning('')
    setGpsMessage(
      'GPS will start automatically when you press Start lesson.',
    )
  }

  useImperativeHandle(
    ref,
    () => ({
      startRecording,
      finishRecording,
      discardRecording,
      isRecording: () =>
        isRecordingRef.current,
    }),
  )

  const statusLabel =
    recordingState === 'recording'
      ? 'Recording'
      : recordingState === 'finished'
        ? 'Finished'
        : 'Ready'

  return (
    <div className="lesson-card spaced-card gps-card">
      <div className="gps-heading">
        <div>
          <p className="section-label">
            Automatic
          </p>

          <h3>GPS tracking</h3>
        </div>

        <span
          className={
            recordingState === 'recording'
              ? 'gps-status recording'
              : 'gps-status'
          }
        >
          {statusLabel}
        </span>
      </div>

      <p>
        {recordingState === 'recording'
          ? 'Lesson and GPS are running together. Keep JackTrack open and the screen unlocked for the most reliable route.'
          : recordingState === 'finished'
            ? 'GPS has stopped. Complete the lesson reflection and save when ready.'
            : 'You do not need to start GPS separately. Press Start lesson below when safely parked and JackTrack will start both together.'}
      </p>

      <div className="gps-stat-grid">
        <div>
          <strong>
            {formatElapsedTime(
              elapsedSeconds,
            )}
          </strong>

          <span>elapsed</span>
        </div>

        <div>
          <strong>
            {distanceMiles.toFixed(2)}
          </strong>

          <span>miles</span>
        </div>

        <div>
          <strong>{route.length}</strong>

          <span>GPS points</span>
        </div>
      </div>

      <p className="gps-message">
        {gpsMessage}
      </p>

      {recordingWarning && (
        <div className="lesson-card skills-summary">
          <h3>GPS recording warning</h3>

          <p>{recordingWarning}</p>
        </div>
      )}
    </div>
  )
})

export default GpsRecorder
