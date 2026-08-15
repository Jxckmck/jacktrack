import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type {
  CSSProperties,
  TouchEvent,
} from 'react'
import './AppTour.css'

type TourTab =
  | 'home'
  | 'lesson'
  | 'progress'
  | 'more'

type TourStep = {
  tab: TourTab
  targetSelector: string
  eyebrow: string
  title: string
  description: string
}

type AppTourProps = {
  onClose: () => void
  onNavigate: (tab: TourTab) => void
}

type TargetRect = {
  top: number
  left: number
  width: number
  height: number
  right: number
  bottom: number
}

type CoachmarkPlacement =
  | 'above'
  | 'below'

type CoachmarkLayout = {
  placement: CoachmarkPlacement
  calloutStyle: CSSProperties
  arrowStyle: CSSProperties
}

const tourSteps: TourStep[] = [
  {
    tab: 'home',
    targetSelector:
      '[data-tour="home-start-lesson"]',
    eyebrow: 'Start here',
    title: 'Start a lesson',
    description:
      'This is the main action. Tap it whenever you are ready to practise and JackTrack will show the lesson choices.',
  },
  {
    tab: 'home',
    targetSelector:
      '[data-tour="home-recommended"]',
    eyebrow: 'Recommended next',
    title: 'JackTrack suggests a useful focus',
    description:
      'This recommendation changes as confidence and practice history build. You can use it or choose something else.',
  },
  {
    tab: 'home',
    targetSelector:
      '[data-tour="nav-lesson"]',
    eyebrow: 'Lesson',
    title: 'All practice starts here',
    description:
      'The Lesson tab is where you choose between guided teaching and a deliberately unguided drive.',
  },
  {
    tab: 'lesson',
    targetSelector:
      '[data-tour="lesson-recommended"]',
    eyebrow: 'Guided lesson',
    title: 'Use the recommended lesson',
    description:
      'JackTrack chooses the skill and gives you the teaching plan automatically. This is the simplest guided option.',
  },
  {
    tab: 'lesson',
    targetSelector:
      '[data-tour="lesson-guided"]',
    eyebrow: 'Choose the focus',
    title: 'You can pick any skill yourself',
    description:
      'Choose a different DVSA skill and you still get the same guided teaching support and Instructor Mode.',
  },
  {
    tab: 'lesson',
    targetSelector:
      '[data-tour="lesson-unguided"]',
    eyebrow: 'Unguided lesson',
    title: 'Use this only when you want flexibility',
    description:
      'Unguided still records GPS, reflections and confidence, but it intentionally leaves out the teaching plan.',
  },
  {
    tab: 'lesson',
    targetSelector:
      '[data-tour="nav-progress"]',
    eyebrow: 'Progress',
    title: 'This becomes useful after lessons',
    description:
      'Open Progress to see confidence, practice flags and the areas that deserve attention next.',
  },
  {
    tab: 'progress',
    targetSelector:
      '[data-tour="progress-overview"]',
    eyebrow: 'Learning overview',
    title: 'A quick picture of where things stand',
    description:
      'These numbers show how many skills are rated, average confidence and how many areas need more practice.',
  },
  {
    tab: 'progress',
    targetSelector:
      '[data-tour="nav-more"]',
    eyebrow: 'More',
    title: 'Settings and less frequent tools live here',
    description:
      'You will not need this screen every drive, so JackTrack keeps it out of the main lesson flow.',
  },
  {
    tab: 'more',
    targetSelector:
      '[data-tour="more-appearance"]',
    eyebrow: 'Day or night',
    title: 'Switch the appearance whenever you need',
    description:
      'Use Light during the day and Dark when you want a calmer screen in the evening.',
  },
  {
    tab: 'more',
    targetSelector:
      '[data-tour="more-backup"]',
    eyebrow: 'Protect the learner record',
    title: 'Backup and restore are here',
    description:
      'Export a backup occasionally so lesson history, confidence and saved routes can be restored if needed.',
  },
  {
    tab: 'more',
    targetSelector:
      '[data-tour="more-app-tour"]',
    eyebrow: 'Need another look?',
    title: 'Replay this tour at any time',
    description:
      'You do not need to remember everything now. Come back here whenever you want JackTrack to show you around again.',
  },
]

const clamp = (
  value: number,
  min: number,
  max: number,
) => Math.min(max, Math.max(min, value))

function useTargetRect(
  targetSelector: string,
  refreshKey: string | number,
) {
  const [targetRect, setTargetRect] =
    useState<TargetRect | null>(null)

  const measure = useCallback(() => {
    const element =
      document.querySelector<HTMLElement>(
        targetSelector,
      )

    if (!element) {
      setTargetRect(null)
      return false
    }

    const rect =
      element.getBoundingClientRect()

    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      right: rect.right,
      bottom: rect.bottom,
    })

    return true
  }, [targetSelector])

  useLayoutEffect(() => {
    let cancelled = false
    let attempt = 0
    let timeoutId = 0

    const findAndMeasure = () => {
      if (cancelled) return

      const element =
        document.querySelector<HTMLElement>(
          targetSelector,
        )

      if (!element) {
        attempt += 1

        if (attempt < 20) {
          timeoutId = window.setTimeout(
            findAndMeasure,
            45,
          )
        }

        return
      }

      element.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'auto',
      })

      timeoutId = window.setTimeout(
        () => {
          if (!cancelled) {
            measure()
          }
        },
        55,
      )
    }

    findAndMeasure()

    const handleResize = () => {
      measure()
    }

    window.addEventListener(
      'resize',
      handleResize,
    )

    window.addEventListener(
      'orientationchange',
      handleResize,
    )

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      window.removeEventListener(
        'resize',
        handleResize,
      )
      window.removeEventListener(
        'orientationchange',
        handleResize,
      )
    }
  }, [
    measure,
    refreshKey,
    targetSelector,
  ])

  return targetRect
}

function getCoachmarkLayout(
  targetRect: TargetRect,
  calloutHeight: number,
): CoachmarkLayout {
  const viewportWidth =
    window.innerWidth

  const viewportHeight =
    window.innerHeight

  const calloutWidth = Math.min(
    370,
    viewportWidth - 28,
  )

  const horizontalCentre =
    targetRect.left +
    targetRect.width / 2

  const left = clamp(
    horizontalCentre -
      calloutWidth / 2,
    14,
    viewportWidth -
      calloutWidth -
      14,
  )

  const availableBelow =
    viewportHeight -
    targetRect.bottom -
    18

  const availableAbove =
    targetRect.top - 18

  const placement: CoachmarkPlacement =
    availableBelow >= calloutHeight + 12 ||
    availableBelow >= availableAbove
      ? 'below'
      : 'above'

  const top =
    placement === 'below'
      ? clamp(
          targetRect.bottom + 14,
          14,
          viewportHeight -
            calloutHeight -
            14,
        )
      : clamp(
          targetRect.top -
            calloutHeight -
            14,
          14,
          viewportHeight -
            calloutHeight -
            14,
        )

  const arrowLeft = clamp(
    horizontalCentre - left - 9,
    22,
    calloutWidth - 40,
  )

  return {
    placement,
    calloutStyle: {
      width: `${calloutWidth}px`,
      left: `${left}px`,
      top: `${top}px`,
    },
    arrowStyle: {
      left: `${arrowLeft}px`,
    },
  }
}

type CoachmarkCardProps = {
  targetSelector: string
  refreshKey: string | number
  eyebrow: string
  title: string
  description: string
  stepLabel?: string
  onBack?: () => void
  onNext: () => void
  onSkip?: () => void
  nextLabel: string
  canGoBack?: boolean
  swipeBack?: () => void
  swipeForward?: () => void
}

function CoachmarkCard({
  targetSelector,
  refreshKey,
  eyebrow,
  title,
  description,
  stepLabel,
  onBack,
  onNext,
  onSkip,
  nextLabel,
  canGoBack = false,
  swipeBack,
  swipeForward,
}: CoachmarkCardProps) {
  const targetRect = useTargetRect(
    targetSelector,
    refreshKey,
  )

  const calloutRef =
    useRef<HTMLDivElement>(null)

  const touchStartX =
    useRef<number | null>(null)

  const [calloutHeight, setCalloutHeight] =
    useState(190)

  useLayoutEffect(() => {
    if (!calloutRef.current) return

    setCalloutHeight(
      calloutRef.current.offsetHeight,
    )
  }, [
    description,
    targetRect,
    title,
  ])

  const layout =
    targetRect
      ? getCoachmarkLayout(
          targetRect,
          calloutHeight,
        )
      : null

  const handleTouchStart = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    touchStartX.current =
      event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    if (touchStartX.current === null) {
      return
    }

    const endX =
      event.changedTouches[0]?.clientX ??
      touchStartX.current

    const movement =
      endX - touchStartX.current

    touchStartX.current = null

    if (
      movement <= -55 &&
      swipeForward
    ) {
      swipeForward()
    }

    if (
      movement >= 55 &&
      swipeBack
    ) {
      swipeBack()
    }
  }

  return (
    <div
      className="coachmark-layer"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {targetRect && (
        <div
          className="coachmark-highlight"
          style={{
            top: `${targetRect.top - 7}px`,
            left: `${targetRect.left - 7}px`,
            width: `${targetRect.width + 14}px`,
            height: `${targetRect.height + 14}px`,
          }}
          aria-hidden="true"
        />
      )}

      {onSkip && (
        <button
          type="button"
          className="coachmark-skip"
          onClick={onSkip}
        >
          Skip tour
        </button>
      )}

      {targetRect && layout ? (
        <div
          ref={calloutRef}
          className={`coachmark-callout coachmark-callout--${layout.placement}`}
          style={layout.calloutStyle}
        >
          <span
            className="coachmark-arrow"
            style={layout.arrowStyle}
            aria-hidden="true"
          />

          <div className="coachmark-heading-row">
            <div>
              <p className="coachmark-eyebrow">
                {eyebrow}
              </p>

              <h2>{title}</h2>
            </div>

            {stepLabel && (
              <span className="coachmark-step-label">
                {stepLabel}
              </span>
            )}
          </div>

          <p className="coachmark-description">
            {description}
          </p>

          <div className="coachmark-actions">
            {canGoBack && onBack ? (
              <button
                type="button"
                className="coachmark-back"
                onClick={onBack}
              >
                Back
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              className="coachmark-next"
              onClick={onNext}
            >
              {nextLabel}
              <span aria-hidden="true">›</span>
            </button>
          </div>

          {swipeForward && (
            <p className="coachmark-swipe-hint">
              Swipe to move through the tour
            </p>
          )}
        </div>
      ) : (
        <div className="coachmark-loading">
          <span className="coachmark-loading-dot" />
          <span>Getting this screen ready…</span>
        </div>
      )}
    </div>
  )
}

function AppTour({
  onClose,
  onNavigate,
}: AppTourProps) {
  const [stepIndex, setStepIndex] =
    useState(0)

  const step = tourSteps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast =
    stepIndex === tourSteps.length - 1

  useEffect(() => {
    onNavigate(step.tab)
  }, [onNavigate, step.tab])

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'ArrowRight') {
        if (isLast) {
          onClose()
        } else {
          setStepIndex(
            (current) => current + 1,
          )
        }
      }

      if (
        event.key === 'ArrowLeft' &&
        !isFirst
      ) {
        setStepIndex(
          (current) => current - 1,
        )
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [isFirst, isLast, onClose])

  const goForward = () => {
    if (isLast) {
      onClose()
      return
    }

    setStepIndex(
      (current) => current + 1,
    )
  }

  const goBack = () => {
    if (isFirst) return

    setStepIndex(
      (current) => current - 1,
    )
  }

  return (
    <CoachmarkCard
      targetSelector={step.targetSelector}
      refreshKey={`${stepIndex}-${step.tab}`}
      eyebrow={step.eyebrow}
      title={step.title}
      description={step.description}
      stepLabel={`${stepIndex + 1}/${tourSteps.length}`}
      onBack={goBack}
      onNext={goForward}
      onSkip={onClose}
      nextLabel={isLast ? 'Done' : 'Next'}
      canGoBack={!isFirst}
      swipeBack={
        isFirst ? undefined : goBack
      }
      swipeForward={goForward}
    />
  )
}

type ContextCoachmarkProps = {
  targetSelector: string
  eyebrow: string
  title: string
  description: string
  buttonLabel?: string
  onClose: () => void
}

export function ContextCoachmark({
  targetSelector,
  eyebrow,
  title,
  description,
  buttonLabel = 'Got it',
  onClose,
}: ContextCoachmarkProps) {
  return (
    <CoachmarkCard
      targetSelector={targetSelector}
      refreshKey={targetSelector}
      eyebrow={eyebrow}
      title={title}
      description={description}
      onNext={onClose}
      nextLabel={buttonLabel}
    />
  )
}

export default AppTour
