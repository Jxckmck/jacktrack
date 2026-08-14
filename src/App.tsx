import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ChangeEvent } from 'react'
import './App.css'
import GpsRecorder from './GpsRecorder'
import type {
  GpsCoverageSummary,
  GpsRecorderHandle,
  RoutePoint,
} from './GpsRecorder'
import RouteMap from './RouteMap'
import type { ReflectionMarker } from './RouteMap'
import AvatarIcon from './AvatarIcon'
import SkillGuidancePanel from './SkillGuidancePanel'
import StructuredLessonPlan from './StructuredLessonPlan'
import { skillGuidance } from './skillGuidance'
import { avatarChoices } from './learnerProfile'
import type {
  AvatarChoice,
  LearnerProfile,
  TransmissionType,
} from './learnerProfile'

type Tab =
  | 'home'
  | 'lesson'
  | 'progress'
  | 'more'

type LessonSessionState =
  | 'setup'
  | 'active'
  | 'review'

type ConfidenceRating = 1 | 2 | 3 | 4 | 5

type SkillAssessment = {
  skillId: number
  confidenceBefore: ConfidenceRating | null
  confidenceAfter: ConfidenceRating | null
  needsMorePractice: boolean
  supervisorNote?: string
}

type SkillPracticeSnapshot = {
  confidence: ConfidenceRating | null
  needsMorePractice: boolean
  note: string
}

type DrivingSkill = {
  id: number
  name: string
  automaticNote?: string
}

type SkillGroup = {
  name: string
  skills: DrivingSkill[]
}

type Lesson = {
  id: number
  date: string
  duration: string
  roadType: string
  objectives: string
  skills: number[]
  lessonType?: 'Guided' | 'Unguided'
  primarySkillId?: number
  skillAssessments?: SkillAssessment[]
  wentWell: string
  needsWork: string
  nextLesson: string
  route?: RoutePoint[]
  gpsDurationSeconds?: number
  gpsDistanceMiles?: number
  gpsCoverage?: GpsCoverageSummary
  reflectionMarkers?: ReflectionMarker[]
}

type SavedData = {
  lessons: Lesson[]
}

type BackupData = SavedData & {
  profile?: LearnerProfile
  progress?: Record<number, string>
}

type AppProps = {
  profile: LearnerProfile
  onProfileChange: (
    updatedProfile: LearnerProfile,
  ) => void
}

const STORAGE_KEY = 'jacktrack-data-v1'

const confidenceLabels: Record<
  ConfidenceRating,
  string
> = {
  1: 'Not confident',
  2: 'A bit unsure',
  3: 'Getting there',
  4: 'Confident',
  5: 'Very confident',
}

const roadTypes = [
  'Quiet residential roads',
  'Industrial estate',
  'Town centre',
  'Rural roads',
  'Dual carriageway',
  'Mixed roads',
  'Car park or private land',
]

const skillGroups: SkillGroup[] = [
  {
    name: '1. The basics',
    skills: [
      {
        id: 1,
        name: 'Legal responsibilities',
      },
      {
        id: 2,
        name: 'Safety checks',
      },
      {
        id: 3,
        name: 'Cockpit checks',
        automaticNote:
          'Check the parking brake is applied and the selector is in P before starting.',
      },
      {
        id: 4,
        name: 'Security',
      },
    ],
  },
  {
    name: '2. Control and positioning',
    skills: [
      {
        id: 5,
        name: 'Controls and instruments',
        automaticNote:
          'Focus on smooth accelerator and brake use, selector positions and controls specific to the automatic car.',
      },
      {
        id: 6,
        name: 'Moving away and stopping',
        automaticNote:
          'Use controlled brake release and accelerator pressure. There is no clutch or biting point.',
      },
      {
        id: 7,
        name: 'Safe positioning',
      },
    ],
  },
  {
    name: '3. Observations, signalling and planning',
    skills: [
      {
        id: 8,
        name: 'Mirrors – vision and use',
      },
      {
        id: 9,
        name: 'Signals',
      },
      {
        id: 10,
        name: 'Anticipation and planning',
      },
      {
        id: 11,
        name: 'Use of speed',
      },
      {
        id: 12,
        name: 'Other traffic',
      },
      {
        id: 13,
        name: 'Fuel-efficient driving',
        automaticNote:
          'Plan ahead, accelerate smoothly and avoid unnecessary heavy braking.',
      },
    ],
  },
  {
    name: '4. Junctions, roundabouts and crossings',
    skills: [
      {
        id: 14,
        name: 'Junctions',
      },
      {
        id: 15,
        name: 'Roundabouts',
      },
      {
        id: 16,
        name: 'Pedestrian crossings',
      },
    ],
  },
  {
    name: '5. Manoeuvres',
    skills: [
      {
        id: 17,
        name: 'Reversing',
        automaticNote:
          'Control speed mainly with the brake and use very light accelerator only where required.',
      },
      {
        id: 18,
        name: 'Turning the car around',
        automaticNote:
          'Keep the car slow using controlled brake pressure and complete all-round observations.',
      },
      {
        id: 19,
        name: 'Parking',
        automaticNote:
          'Use creep and controlled braking while maintaining observations throughout.',
      },
      {
        id: 20,
        name: 'Emergency stop',
        automaticNote:
          'Brake firmly and promptly. There is no clutch pedal to operate.',
      },
    ],
  },
  {
    name: '6. Road types',
    skills: [
      {
        id: 21,
        name: 'Country roads',
      },
      {
        id: 22,
        name: 'Dual carriageways',
      },
      {
        id: 23,
        name: 'Motorways',
        automaticNote:
          'Motorway practice is only permitted with an approved driving instructor in a dual-control car.',
      },
    ],
  },
  {
    name: '7. Driving conditions',
    skills: [
      {
        id: 24,
        name: 'Driving in the dark',
      },
      {
        id: 25,
        name: 'Weather conditions',
      },
      {
        id: 26,
        name: 'Passengers and loads',
      },
    ],
  },
  {
    name: '8. Following routes',
    skills: [
      {
        id: 27,
        name: 'Independent driving and using a sat nav',
      },
    ],
  },
]

const allSkills = skillGroups.flatMap(
  (group) => group.skills,
)

const isConfidenceRating = (
  value: unknown,
): value is ConfidenceRating =>
  value === 1 ||
  value === 2 ||
  value === 3 ||
  value === 4 ||
  value === 5

const formatConfidence = (
  value: ConfidenceRating | null,
) =>
  value === null
    ? 'Not rated'
    : `${value}/5 · ${confidenceLabels[value]}`

const loadSavedData = (): SavedData => {
  const defaultData: SavedData = {
    lessons: [],
  }

  try {
    const savedData =
      localStorage.getItem(STORAGE_KEY)

    if (!savedData) return defaultData

    const parsedData = JSON.parse(
      savedData,
    ) as Partial<SavedData>

    return {
      lessons: Array.isArray(parsedData.lessons)
        ? parsedData.lessons
        : [],
    }
  } catch {
    return defaultData
  }
}

const formatLessonDate = (date: string) => {
  const parsedDate = new Date(
    `${date}T12:00:00`,
  )

  return parsedDate.toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  )
}

const formatGpsTime = (seconds = 0) => {
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

const formatGpsInterruption = (seconds = 0) => {
  const roundedSeconds = Math.max(
    0,
    Math.round(seconds),
  )
  const hours = Math.floor(
    roundedSeconds / 3600,
  )
  const minutes = Math.floor(
    (roundedSeconds % 3600) / 60,
  )
  const remainingSeconds =
    roundedSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }

  return `${remainingSeconds}s`
}

const getSkillName = (skillId: number) =>
  allSkills.find(
    (skill) => skill.id === skillId,
  )?.name ?? `Skill ${skillId}`

const createStreetViewUrl = (
  marker: ReflectionMarker,
) =>
  `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${marker.latitude},${marker.longitude}`

const createSafeFilename = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'learner'

const getSuggestedRoadType = (
  skillId: number,
) => {
  if ([1, 2, 3, 4, 5].includes(skillId)) {
    return 'Car park or private land'
  }

  if ([6, 7, 8, 9, 10, 11, 12, 13].includes(skillId)) {
    return 'Quiet residential roads'
  }

  if ([14, 15, 16].includes(skillId)) {
    return 'Town centre'
  }

  if ([17, 18, 19, 20].includes(skillId)) {
    return 'Car park or private land'
  }

  if (skillId === 21) {
    return 'Rural roads'
  }

  if ([22, 23].includes(skillId)) {
    return 'Dual carriageway'
  }

  return 'Mixed roads'
}

function ProgressRing({
  percentage,
}: {
  percentage: number
}) {
  const radius = 43
  const circumference =
    2 * Math.PI * radius

  const progressLength =
    (percentage / 100) * circumference

  return (
    <div
      className="jt-progress-ring"
      aria-label={`${percentage}% of skills confidence-rated`}
    >
      <svg viewBox="0 0 100 100">
        <circle
          className="progress-circle-track"
          cx="50"
          cy="50"
          r={radius}
        />

        <circle
          className="progress-circle-value"
          cx="50"
          cy="50"
          r={radius}
          stroke="#2563eb"
          strokeDasharray={`${progressLength} ${
            circumference - progressLength
          }`}
        />
      </svg>

      <div className="progress-circle-label">
        <strong>{percentage}%</strong>
        <span>rated</span>
      </div>
    </div>
  )
}

function ConfidenceSlider({
  value,
  onChange,
  label,
}: {
  value: ConfidenceRating | null
  onChange: (value: ConfidenceRating) => void
  label: string
}) {
  const displayValue = value ?? 1
  const fillPercentage =
    value === null
      ? 0
      : ((value - 1) / 4) * 100

  return (
    <div
      className={
        value === null
          ? 'confidence-control not-rated'
          : 'confidence-control'
      }
    >
      <div className="confidence-value-row">
        <strong>
          {value === null
            ? 'Not rated yet'
            : `${value}/5`}
        </strong>

        <span>
          {value === null
            ? 'Move the slider to add a rating'
            : confidenceLabels[value]}
        </span>
      </div>

      <div className="confidence-slider-shell">
        <div
          className="confidence-slider-track"
          aria-hidden="true"
        >
          <span
            style={{
              width: `${fillPercentage}%`,
            }}
          />
        </div>

        <input
          className="confidence-slider"
          type="range"
          min="1"
          max="5"
          step="1"
          value={displayValue}
          aria-label={label}
          aria-valuetext={
            value === null
              ? 'Not rated yet'
              : `${value} out of 5, ${confidenceLabels[value]}`
          }
          onPointerDown={() => {
            if (value === null) {
              onChange(1)
            }
          }}
          onChange={(event) =>
            onChange(
              Number(
                event.target.value,
              ) as ConfidenceRating,
            )
          }
        />
      </div>

      <div
        className="confidence-scale"
        aria-hidden="true"
      >
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  )
}

function ConfidenceMiniMeter({
  value,
}: {
  value: ConfidenceRating | null
}) {
  const levels: ConfidenceRating[] = [
    1,
    2,
    3,
    4,
    5,
  ]

  return (
    <div
      className={
        value === null
          ? 'confidence-mini-meter not-rated'
          : 'confidence-mini-meter'
      }
      aria-label={formatConfidence(value)}
    >
      {levels.map((level) => (
        <span
          key={level}
          className={
            value !== null && level <= value
              ? 'filled'
              : ''
          }
        />
      ))}
    </div>
  )
}

function App({
  profile,
  onProfileChange,
}: AppProps) {
  const initialData = loadSavedData()

  const [activeTab, setActiveTab] =
    useState<Tab>('home')

  const [selectedSkill, setSelectedSkill] =
    useState<DrivingSkill | null>(null)

  const [
    selectedLessonId,
    setSelectedLessonId,
  ] = useState<number | null>(null)

  const [
    justSavedLessonId,
    setJustSavedLessonId,
  ] = useState<number | null>(null)

  const [isAddingMarker, setIsAddingMarker] =
    useState(false)

  const [lessons, setLessons] = useState<
    Lesson[]
  >(initialData.lessons)

  const [lessonDate, setLessonDate] =
    useState(
      new Date().toISOString().slice(0, 10),
    )

  const [
    lessonDuration,
    setLessonDuration,
  ] = useState('')

  const [roadType, setRoadType] =
    useState('Quiet residential roads')

  const [objectives, setObjectives] =
    useState('')

  const [
    selectedLessonSkills,
    setSelectedLessonSkills,
  ] = useState<number[]>([])

  const [
    lessonConfidenceDraft,
    setLessonConfidenceDraft,
  ] = useState<
    Record<number, ConfidenceRating | null>
  >({})

  const [
    lessonPracticeDraft,
    setLessonPracticeDraft,
  ] = useState<
    Record<number, SkillPracticeSnapshot>
  >({})

  const [wentWell, setWentWell] =
    useState('')

  const [needsWork, setNeedsWork] =
    useState('')

  const [nextLesson, setNextLesson] =
    useState('')

  const [
    practiceNoteSkillId,
    setPracticeNoteSkillId,
  ] = useState<number | null>(null)

  const [
    practiceNoteDraft,
    setPracticeNoteDraft,
  ] = useState('')

  const [lessonSaved, setLessonSaved] =
    useState(false)

  const [
    recordedRoute,
    setRecordedRoute,
  ] = useState<RoutePoint[]>([])

  const [
    gpsDurationSeconds,
    setGpsDurationSeconds,
  ] = useState(0)

  const [
    gpsDistanceMiles,
    setGpsDistanceMiles,
  ] = useState(0)

  const [
    gpsCoverage,
    setGpsCoverage,
  ] = useState<GpsCoverageSummary | null>(
    null,
  )

  const [
    backupMessage,
    setBackupMessage,
  ] = useState('')

  const [resetMessage, setResetMessage] =
    useState('')

  const [
    editingLessonId,
    setEditingLessonId,
  ] = useState<number | null>(null)

  const [editDate, setEditDate] =
    useState('')

  const [
    editDuration,
    setEditDuration,
  ] = useState('')

  const [editRoadType, setEditRoadType] =
    useState('')

  const [
    editObjectives,
    setEditObjectives,
  ] = useState('')

  const [editSkills, setEditSkills] =
    useState<number[]>([])

  const [
    editWentWell,
    setEditWentWell,
  ] = useState('')

  const [
    editNeedsWork,
    setEditNeedsWork,
  ] = useState('')

  const [
    editNextLesson,
    setEditNextLesson,
  ] = useState('')

  const [
    isEditingProfile,
    setIsEditingProfile,
  ] = useState(false)

  const [
    profileName,
    setProfileName,
  ] = useState(profile.name)

  const [
    profileTransmission,
    setProfileTransmission,
  ] = useState<TransmissionType>(
    profile.transmission,
  )

  const [
    profileAvatar,
    setProfileAvatar,
  ] = useState<AvatarChoice>(
    profile.avatar,
  )

  const [
    profileMessage,
    setProfileMessage,
  ] = useState('')

  const [
    plannedLessonSkill,
    setPlannedLessonSkill,
  ] = useState<DrivingSkill | null>(null)

  const [
    lessonSetupOpen,
    setLessonSetupOpen,
  ] = useState(false)

  const [
    lessonSessionState,
    setLessonSessionState,
  ] = useState<LessonSessionState>(
    'setup',
  )

  const [
    isChoosingLessonSkill,
    setIsChoosingLessonSkill,
  ] = useState(false)

  const [
    progressView,
    setProgressView,
  ] = useState<'overview' | 'skills'>(
    'overview',
  )

  const gpsRecorderRef =
    useRef<GpsRecorderHandle | null>(null)

  const reviewReflectionRef =
    useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lessons,
      }),
    )
  }, [lessons])

  useEffect(() => {
    setProfileName(profile.name)
    setProfileTransmission(
      profile.transmission,
    )
    setProfileAvatar(profile.avatar)
  }, [profile])

  useEffect(() => {
    if (lessonSessionState !== 'review') {
      return
    }

    const frameId =
      window.requestAnimationFrame(() => {
        reviewReflectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })

    return () =>
      window.cancelAnimationFrame(frameId)
  }, [lessonSessionState])

  const currentSkillState = (() => {
    const snapshot: Record<
      number,
      SkillPracticeSnapshot
    > = {}

    allSkills.forEach((skill) => {
      snapshot[skill.id] = {
        confidence: null,
        needsMorePractice: false,
        note: '',
      }
    })

    const resolvedSkillIds = new Set<number>()

    lessons.forEach((lesson) => {
      ;(lesson.skillAssessments ?? []).forEach(
        (assessment) => {
          if (
            resolvedSkillIds.has(
              assessment.skillId,
            )
          ) {
            return
          }

          snapshot[assessment.skillId] = {
            confidence: isConfidenceRating(
              assessment.confidenceAfter,
            )
              ? assessment.confidenceAfter
              : null,
            needsMorePractice: Boolean(
              assessment.needsMorePractice,
            ),
            note:
              assessment.supervisorNote?.trim() ??
              '',
          }

          resolvedSkillIds.add(
            assessment.skillId,
          )
        },
      )
    })

    return snapshot
  })()

  const ratedSkills = allSkills.filter(
    (skill) =>
      currentSkillState[skill.id]
        .confidence !== null,
  )

  const ratedSkillCount = ratedSkills.length

  const confidenceCoverage = Math.round(
    (ratedSkillCount / allSkills.length) * 100,
  )

  const averageConfidence =
    ratedSkillCount === 0
      ? null
      : ratedSkills.reduce(
          (total, skill) =>
            total +
            (currentSkillState[skill.id]
              .confidence ?? 0),
          0,
        ) / ratedSkillCount

  const needsMorePracticeCount =
    allSkills.filter(
      (skill) =>
        currentSkillState[skill.id]
          .needsMorePractice,
    ).length

  const needsMorePracticeSkills =
    allSkills
      .filter(
        (skill) =>
          currentSkillState[skill.id]
            .needsMorePractice,
      )
      .sort((first, second) => {
        const firstConfidence =
          currentSkillState[first.id]
            .confidence ?? 6
        const secondConfidence =
          currentSkillState[second.id]
            .confidence ?? 6

        return (
          firstConfidence -
          secondConfidence
        )
      })

  const notYetRatedSkills =
    allSkills.filter(
      (skill) =>
        currentSkillState[skill.id]
          .confidence === null,
    )

  const lowestConfidenceSkills = [
    ...ratedSkills,
  ]
    .sort((first, second) => {
      const firstRating =
        currentSkillState[first.id]
          .confidence ?? 6
      const secondRating =
        currentSkillState[second.id]
          .confidence ?? 6

      if (firstRating !== secondRating) {
        return firstRating - secondRating
      }

      const firstFlag = currentSkillState[
        first.id
      ].needsMorePractice
        ? 0
        : 1
      const secondFlag = currentSkillState[
        second.id
      ].needsMorePractice
        ? 0
        : 1

      return firstFlag - secondFlag
    })
    .slice(0, 5)

  const skillTrainingStats = (() => {
    const stats: Record<
      number,
      {
        practiceCount: number
        lastPractisedLessonIndex: number | null
        confidenceHistory: ConfidenceRating[]
      }
    > = {}

    allSkills.forEach((skill) => {
      stats[skill.id] = {
        practiceCount: 0,
        lastPractisedLessonIndex: null,
        confidenceHistory: [],
      }
    })

    lessons.forEach((lesson, lessonIndex) => {
      const lessonSkillIds = new Set([
        ...lesson.skills,
        ...(lesson.skillAssessments ?? []).map(
          (assessment) => assessment.skillId,
        ),
      ])

      lessonSkillIds.forEach((skillId) => {
        const skillStats = stats[skillId]

        if (!skillStats) return

        skillStats.practiceCount += 1

        if (
          skillStats.lastPractisedLessonIndex ===
          null
        ) {
          skillStats.lastPractisedLessonIndex =
            lessonIndex
        }
      })

      ;(lesson.skillAssessments ?? []).forEach(
        (assessment) => {
          if (
            !stats[assessment.skillId] ||
            !isConfidenceRating(
              assessment.confidenceAfter,
            )
          ) {
            return
          }

          stats[
            assessment.skillId
          ].confidenceHistory.push(
            assessment.confidenceAfter,
          )
        },
      )
    })

    return stats
  })()

  const recommendationCandidates = allSkills
    .filter((skill) => skill.id !== 23)
    .map((skill) => {
      const skillState =
        currentSkillState[skill.id]
      const skillStats =
        skillTrainingStats[skill.id]
      const confidence = skillState.confidence
      const previousConfidence =
        skillStats.confidenceHistory[1] ?? null
      const lessonsSincePractised =
        skillStats.lastPractisedLessonIndex

      let score = 0

      if (skillState.needsMorePractice) {
        score += 110
      }

      if (confidence === null) {
        score +=
          skillStats.practiceCount > 0 ? 62 : 52
      } else {
        score += (6 - confidence) * 18

        if (confidence <= 2) {
          score += 20
        } else if (confidence === 3) {
          score += 6
        }
      }

      if (lessonsSincePractised === null) {
        score += 12
      } else if (lessonsSincePractised === 0) {
        if (
          !skillState.needsMorePractice &&
          (confidence === null || confidence >= 3)
        ) {
          score -= 24
        }
      } else if (lessonsSincePractised === 1) {
        score -= 10
      } else if (lessonsSincePractised >= 5) {
        score += 18
      } else if (lessonsSincePractised >= 3) {
        score += 10
      } else {
        score += 4
      }

      if (skillStats.practiceCount === 0) {
        score += 8
      } else if (skillStats.practiceCount === 1) {
        score += 4
      }

      if (
        previousConfidence !== null &&
        confidence !== null
      ) {
        if (confidence < previousConfidence) {
          score += 30
        } else if (
          confidence === previousConfidence &&
          confidence <= 3 &&
          skillStats.confidenceHistory.length >= 2
        ) {
          score += 8
        } else if (
          confidence > previousConfidence &&
          confidence >= 4 &&
          !skillState.needsMorePractice
        ) {
          score -= 6
        }
      }

      if (
        confidence !== null &&
        confidence >= 4 &&
        lessonsSincePractised !== null &&
        lessonsSincePractised <= 1 &&
        !skillState.needsMorePractice
      ) {
        score -= 18
      }

      return {
        skill,
        score,
        confidence,
        previousConfidence,
        practiceCount: skillStats.practiceCount,
        lessonsSincePractised,
        needsMorePractice:
          skillState.needsMorePractice,
      }
    })
    .sort((first, second) => {
      if (first.score !== second.score) {
        return second.score - first.score
      }

      if (
        first.needsMorePractice !==
        second.needsMorePractice
      ) {
        return first.needsMorePractice ? -1 : 1
      }

      const firstConfidence =
        first.confidence ?? 6
      const secondConfidence =
        second.confidence ?? 6

      if (firstConfidence !== secondConfidence) {
        return firstConfidence - secondConfidence
      }

      const firstRecency =
        first.lessonsSincePractised ?? 999
      const secondRecency =
        second.lessonsSincePractised ?? 999

      if (firstRecency !== secondRecency) {
        return secondRecency - firstRecency
      }

      return first.skill.id - second.skill.id
    })

  const recommendation =
    recommendationCandidates[0]

  const recommendedSkill = recommendation.skill

  const recommendedSkillState =
    currentSkillState[recommendedSkill.id]

  const recommendedReason = (() => {
    const confidence = recommendation.confidence
    const previousConfidence =
      recommendation.previousConfidence
    const lessonsSincePractised =
      recommendation.lessonsSincePractised

    if (recommendation.needsMorePractice) {
      return confidence === null
        ? 'The supervisor has flagged this skill for more practice.'
        : `The supervisor has flagged this skill for more practice, and confidence is ${confidence}/5.`
    }

    if (
      previousConfidence !== null &&
      confidence !== null &&
      confidence < previousConfidence
    ) {
      return `Confidence has dropped from ${previousConfidence}/5 to ${confidence}/5, so a focused revisit is worthwhile.`
    }

    if (confidence !== null && confidence <= 2) {
      return `This is one of the lowest-confidence areas at ${confidence}/5.`
    }

    if (
      confidence === null &&
      recommendation.practiceCount > 0
    ) {
      return 'This skill has been practised but has not been confidence-rated yet.'
    }

    if (recommendation.practiceCount === 0) {
      return 'This skill has not been practised yet, so it is a good area to introduce next.'
    }

    if (
      confidence === 3 &&
      lessonsSincePractised !== null &&
      lessonsSincePractised >= 3
    ) {
      return `Confidence is 3/5 and this has not been practised in the last ${lessonsSincePractised} lessons.`
    }

    if (confidence === 3) {
      return 'Confidence is 3/5, so another focused session should help build consistency.'
    }

    if (
      confidence !== null &&
      lessonsSincePractised !== null &&
      lessonsSincePractised >= 5
    ) {
      return `Confidence is ${confidence}/5, but this has not been practised in the last ${lessonsSincePractised} lessons.`
    }

    return 'This is currently the best balance of confidence, practice history and how recently the skill was covered.'
  })()

  const recommendedPracticeHistory =
    recommendation.practiceCount === 0
      ? 'No recorded practice yet'
      : `${recommendation.practiceCount} recorded ${
          recommendation.practiceCount === 1
            ? 'lesson'
            : 'lessons'
        }${
          recommendation.lessonsSincePractised === 0
            ? ' · practised in the latest lesson'
            : recommendation.lessonsSincePractised !==
                  null &&
                recommendation.lessonsSincePractised >= 2
              ? ` · not practised in the last ${recommendation.lessonsSincePractised} lessons`
              : ''
        }`

  const getLessonConfidence = (
    skillId: number,
  ) =>
    Object.prototype.hasOwnProperty.call(
      lessonConfidenceDraft,
      skillId,
    )
      ? lessonConfidenceDraft[skillId]
      : currentSkillState[skillId]
          .confidence

  const getLessonPractice = (
    skillId: number,
  ): SkillPracticeSnapshot =>
    lessonPracticeDraft[skillId] ??
    currentSkillState[skillId]

  const updateLessonConfidence = (
    skillId: number,
    rating: ConfidenceRating,
  ) => {
    setLessonConfidenceDraft(
      (currentDraft) => ({
        ...currentDraft,
        [skillId]: rating,
      }),
    )
  }

  const setLessonNeedsMorePractice = (
    skillId: number,
    needsMorePractice: boolean,
  ) => {
    const currentPractice =
      getLessonPractice(skillId)

    setLessonPracticeDraft(
      (currentDraft) => ({
        ...currentDraft,
        [skillId]: {
          ...currentPractice,
          needsMorePractice,
          note: needsMorePractice
            ? currentPractice.note
            : '',
        },
      }),
    )

    if (needsMorePractice) {
      setPracticeNoteSkillId(skillId)
      setPracticeNoteDraft(
        currentPractice.note,
      )
    } else if (
      practiceNoteSkillId === skillId
    ) {
      setPracticeNoteSkillId(null)
      setPracticeNoteDraft('')
    }
  }

  const savePracticeNote = () => {
    if (practiceNoteSkillId === null) {
      return
    }

    const skillId = practiceNoteSkillId
    const currentPractice =
      getLessonPractice(skillId)

    setLessonPracticeDraft(
      (currentDraft) => ({
        ...currentDraft,
        [skillId]: {
          ...currentPractice,
          needsMorePractice: true,
          note: practiceNoteDraft.trim(),
        },
      }),
    )

    setPracticeNoteSkillId(null)
    setPracticeNoteDraft('')
  }

  const skipPracticeNote = () => {
    setPracticeNoteSkillId(null)
    setPracticeNoteDraft('')
  }

  const toggleLessonSkill = (
    skillId: number,
  ) => {
    const isAdding =
      !selectedLessonSkills.includes(skillId)

    setSelectedLessonSkills(
      (currentSkills) =>
        isAdding
          ? [...currentSkills, skillId]
          : currentSkills.filter(
              (id) => id !== skillId,
            ),
    )

    if (isAdding) {
      setLessonConfidenceDraft(
        (currentDraft) => ({
          ...currentDraft,
          [skillId]:
            currentSkillState[skillId]
              .confidence,
        }),
      )

      setLessonPracticeDraft(
        (currentDraft) => ({
          ...currentDraft,
          [skillId]: {
            ...currentSkillState[skillId],
          },
        }),
      )
    } else {
      setLessonConfidenceDraft(
        (currentDraft) => {
          const nextDraft = {
            ...currentDraft,
          }
          delete nextDraft[skillId]
          return nextDraft
        },
      )

      setLessonPracticeDraft(
        (currentDraft) => {
          const nextDraft = {
            ...currentDraft,
          }
          delete nextDraft[skillId]
          return nextDraft
        },
      )
    }
  }

  const toggleEditSkill = (
    skillId: number,
  ) => {
    setEditSkills((currentSkills) =>
      currentSkills.includes(skillId)
        ? currentSkills.filter(
            (id) => id !== skillId,
          )
        : [...currentSkills, skillId],
    )
  }

  const clearRecordedLesson = () => {
    gpsRecorderRef.current?.discardRecording()
    setLessonSessionState('setup')
    setRecordedRoute([])
    setGpsDurationSeconds(0)
    setGpsDistanceMiles(0)
    setGpsCoverage(null)
    setLessonConfidenceDraft({})
    setLessonPracticeDraft({})
    setPracticeNoteSkillId(null)
    setPracticeNoteDraft('')
  }

  const confirmLeaveUnsavedLesson = () => {
    if (!lessonSetupOpen) return true

    if (lessonSessionState === 'setup') {
      return true
    }

    const message =
      lessonSessionState === 'active'
        ? 'A lesson is currently in progress. Leaving now will stop GPS and discard this unsaved lesson.\n\nDiscard the lesson and leave?'
        : 'This lesson has finished but has not been saved. Leaving now will discard the GPS route and unsaved reflection.\n\nDiscard the lesson and leave?'

    const confirmed =
      window.confirm(message)

    if (!confirmed) return false

    clearRecordedLesson()
    return true
  }

  const openLessonHub = () => {
    if (!confirmLeaveUnsavedLesson()) {
      return
    }

    setLessonSetupOpen(false)
    setIsChoosingLessonSkill(false)
    setPlannedLessonSkill(null)
    setLessonSessionState('setup')
    setActiveTab('lesson')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const startUnguidedLesson = () => {
    if (
      gpsRecorderRef.current?.isRecording()
    ) {
      window.alert(
        'A lesson is already being recorded. Finish or discard it before starting another.',
      )
      return
    }

    setPlannedLessonSkill(null)
    setLessonDate(
      new Date().toISOString().slice(0, 10),
    )
    setLessonDuration('')
    setRoadType(
      'Quiet residential roads',
    )
    setObjectives('')
    setSelectedLessonSkills([])
    setLessonConfidenceDraft({})
    setLessonPracticeDraft({})
    setPracticeNoteSkillId(null)
    setPracticeNoteDraft('')
    setWentWell('')
    setNeedsWork('')
    setNextLesson('')
    setRecordedRoute([])
    setGpsDurationSeconds(0)
    setGpsDistanceMiles(0)
    setGpsCoverage(null)
    setLessonSaved(false)
    setLessonSessionState('setup')
    setLessonSetupOpen(true)
    setIsChoosingLessonSkill(false)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const planPracticeSession = (
    skill: DrivingSkill,
  ) => {
    if (
      gpsRecorderRef.current?.isRecording()
    ) {
      window.alert(
        'A lesson is already being recorded. Finish or discard it before starting another.',
      )
      return
    }

    const guidance = skillGuidance[skill.id]

    setPlannedLessonSkill(skill)
    setSelectedLessonSkills([skill.id])
    setLessonConfidenceDraft({})
    setLessonPracticeDraft({})
    setPracticeNoteSkillId(null)
    setPracticeNoteDraft('')
    setLessonDuration('')
    setRoadType(
      getSuggestedRoadType(skill.id),
    )

    setObjectives(
      guidance
        ? `Focus on ${skill.name.toLowerCase()}: ${guidance.summary}`
        : `Practise ${skill.name.toLowerCase()} safely and consistently.`,
    )

    setWentWell('')
    setNeedsWork('')
    setNextLesson('')
    setRecordedRoute([])
    setGpsDurationSeconds(0)
    setGpsDistanceMiles(0)
    setGpsCoverage(null)
    setLessonSaved(false)
    setSelectedSkill(null)
    setLessonSessionState('setup')
    setLessonSetupOpen(true)
    setIsChoosingLessonSkill(false)
    setActiveTab('lesson')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const startLesson = () => {
    if (lessonSessionState !== 'setup') {
      return
    }

    if (
      gpsRecorderRef.current?.isRecording()
    ) {
      window.alert(
        'A lesson is already being recorded. Finish or discard it before starting another.',
      )
      return
    }

    const started =
      gpsRecorderRef.current?.startRecording() ??
      false

    if (!started) {
      window.alert(
        'JackTrack could not start GPS. Check the GPS message on screen, then try again.',
      )
      return
    }

    setLessonDuration('')
    setRecordedRoute([])
    setGpsDurationSeconds(0)
    setGpsDistanceMiles(0)
    setGpsCoverage(null)
    setLessonSessionState('active')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const finishLesson = () => {
    if (lessonSessionState !== 'active') {
      return
    }

    if (!gpsRecorderRef.current?.isRecording()) {
      window.alert(
        'GPS is no longer recording. Press Start lesson again before continuing.',
      )
      setLessonSessionState('setup')
      return
    }

    const gpsResult =
      gpsRecorderRef.current.finishRecording()

    setRecordedRoute(gpsResult.route)
    setGpsDurationSeconds(
      gpsResult.durationSeconds,
    )
    setGpsDistanceMiles(
      gpsResult.distanceMiles,
    )
    setGpsCoverage(gpsResult.coverage)

    setLessonDuration(
      Math.max(
        1,
        Math.round(
          gpsResult.durationSeconds / 60,
        ),
      ).toString(),
    )

    const confidenceDraft: Record<
      number,
      ConfidenceRating | null
    > = {}

    const practiceDraft: Record<
      number,
      SkillPracticeSnapshot
    > = {}

    selectedLessonSkills.forEach(
      (skillId) => {
        confidenceDraft[skillId] =
          currentSkillState[skillId]
            .confidence
        practiceDraft[skillId] = {
          ...currentSkillState[skillId],
        }
      },
    )

    setLessonConfidenceDraft(
      confidenceDraft,
    )
    setLessonPracticeDraft(practiceDraft)
    setLessonSessionState('review')
  }

  const discardCurrentLesson = () => {
    const confirmed = window.confirm(
      lessonSessionState === 'active'
        ? 'Discard this lesson? GPS will stop and the current route will be permanently lost.'
        : 'Discard this unsaved lesson? The GPS route and reflection will be permanently lost.',
    )

    if (!confirmed) return

    clearRecordedLesson()
    setLessonSetupOpen(false)
    setPlannedLessonSkill(null)
    setIsChoosingLessonSkill(false)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const saveLesson = () => {
    if (lessonSessionState !== 'review') {
      window.alert(
        'Finish the lesson before saving it.',
      )
      return
    }

    if (recordedRoute.length === 0) {
      const saveWithoutRoute =
        window.confirm(
          'No reliable GPS route was captured. Save this lesson without a route?',
        )

      if (!saveWithoutRoute) return
    }

    const finalDuration = lessonDuration.trim()
      ? lessonDuration.trim()
      : Math.max(
          1,
          Math.round(
            gpsDurationSeconds / 60,
          ),
        ).toString()

    const skillAssessments: SkillAssessment[] =
      selectedLessonSkills.map((skillId) => {
        const currentPractice =
          getLessonPractice(skillId)
        const confidenceAfter =
          getLessonConfidence(skillId)

        return {
          skillId,
          confidenceBefore:
            currentSkillState[skillId]
              .confidence,
          confidenceAfter,
          needsMorePractice:
            currentPractice.needsMorePractice,
          supervisorNote:
            currentPractice.note.trim() ||
            undefined,
        }
      })

    const newLesson: Lesson = {
      id: Date.now(),
      date: lessonDate,
      duration: finalDuration,
      roadType,
      objectives,
      skills: selectedLessonSkills,
      lessonType: plannedLessonSkill
        ? 'Guided'
        : 'Unguided',
      primarySkillId:
        plannedLessonSkill?.id,
      skillAssessments,
      wentWell,
      needsWork,
      nextLesson,
      route: recordedRoute,
      gpsDurationSeconds,
      gpsDistanceMiles,
      gpsCoverage:
        gpsCoverage ?? undefined,
      reflectionMarkers: [],
    }

    setLessons((currentLessons) => [
      newLesson,
      ...currentLessons,
    ])

    setLessonSaved(true)

    window.setTimeout(() => {
      setLessonSaved(false)
    }, 2500)

    setLessonDuration('')
    setObjectives('')
    setSelectedLessonSkills([])
    setLessonConfidenceDraft({})
    setLessonPracticeDraft({})
    setPracticeNoteSkillId(null)
    setPracticeNoteDraft('')
    setWentWell('')
    setNeedsWork('')
    setNextLesson('')
    setRecordedRoute([])
    setGpsDurationSeconds(0)
    setGpsDistanceMiles(0)
    setGpsCoverage(null)
    setPlannedLessonSkill(null)
    setLessonSessionState('setup')
    setLessonSetupOpen(false)
    setIsChoosingLessonSkill(false)
    setSelectedLessonId(newLesson.id)
    setJustSavedLessonId(newLesson.id)
    setEditingLessonId(null)
    setIsAddingMarker(false)
    setActiveTab('progress')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const deleteLesson = (
    lesson: Lesson,
  ) => {
    const confirmed = window.confirm(
      `Delete the lesson from ${formatLessonDate(
        lesson.date,
      )}? This cannot be undone.`,
    )

    if (!confirmed) return

    setLessons((currentLessons) =>
      currentLessons.filter(
        (savedLesson) =>
          savedLesson.id !== lesson.id,
      ),
    )

    setEditingLessonId(null)
    setIsAddingMarker(false)

    if (
      selectedLessonId === lesson.id
    ) {
      setSelectedLessonId(null)
    }

    if (
      justSavedLessonId === lesson.id
    ) {
      setJustSavedLessonId(null)
    }
  }

  const beginEditingLesson = (
    lesson: Lesson,
  ) => {
    setEditingLessonId(lesson.id)
    setEditDate(lesson.date)
    setEditDuration(lesson.duration)
    setEditRoadType(lesson.roadType)
    setEditObjectives(lesson.objectives)
    setEditSkills(lesson.skills)
    setEditWentWell(lesson.wentWell)
    setEditNeedsWork(lesson.needsWork)
    setEditNextLesson(lesson.nextLesson)
  }

  const saveEditedLesson = () => {
    if (editingLessonId === null) return

    if (!editDuration.trim()) {
      window.alert(
        'Please enter the lesson duration.',
      )
      return
    }

    setLessons((currentLessons) =>
      currentLessons.map((lesson) =>
        lesson.id === editingLessonId
          ? {
              ...lesson,
              date: editDate,
              duration: editDuration,
              roadType: editRoadType,
              objectives: editObjectives,
              skills: editSkills,
              skillAssessments:
                lesson.skillAssessments?.filter(
                  (assessment) =>
                    editSkills.includes(
                      assessment.skillId,
                    ),
                ),
              wentWell: editWentWell,
              needsWork: editNeedsWork,
              nextLesson: editNextLesson,
            }
          : lesson,
      ),
    )

    setEditingLessonId(null)
  }

  const addReflectionMarker =
    useCallback(
      (
        latitude: number,
        longitude: number,
      ) => {
        if (
          selectedLessonId === null
        ) {
          return
        }

        const note = window.prompt(
          'What happened at this point?\n\nExample: Late mirror check or good roundabout positioning.',
        )

        if (!note?.trim()) {
          setIsAddingMarker(false)
          return
        }

        const newMarker: ReflectionMarker =
          {
            id: Date.now(),
            latitude,
            longitude,
            note: note.trim(),
            createdAt: Date.now(),
          }

        setLessons(
          (currentLessons) =>
            currentLessons.map(
              (lesson) =>
                lesson.id ===
                selectedLessonId
                  ? {
                      ...lesson,
                      reflectionMarkers: [
                        ...(lesson.reflectionMarkers ??
                          []),
                        newMarker,
                      ],
                    }
                  : lesson,
            ),
        )

        setIsAddingMarker(false)
      },
      [selectedLessonId],
    )

  const deleteReflectionMarker = (
    lessonId: number,
    markerId: number,
  ) => {
    const confirmed = window.confirm(
      'Delete this reflection marker?',
    )

    if (!confirmed) return

    setLessons((currentLessons) =>
      currentLessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              reflectionMarkers:
                (
                  lesson.reflectionMarkers ??
                  []
                ).filter(
                  (marker) =>
                    marker.id !== markerId,
                ),
            }
          : lesson,
      ),
    )
  }

  const exportBackup = () => {
    const fileContents = JSON.stringify(
      {
        lessons,
        profile,
      },
      null,
      2,
    )

    const fileBlob = new Blob(
      [fileContents],
      {
        type: 'application/json',
      },
    )

    const downloadUrl =
      URL.createObjectURL(fileBlob)

    const downloadLink =
      document.createElement('a')

    const date = new Date()
      .toISOString()
      .slice(0, 10)

    downloadLink.href = downloadUrl

    downloadLink.download =
      `jacktrack-${createSafeFilename(
        profile.name,
      )}-backup-${date}.json`

    document.body.appendChild(
      downloadLink,
    )

    downloadLink.click()
    downloadLink.remove()

    URL.revokeObjectURL(downloadUrl)

    setBackupMessage(
      'Backup downloaded successfully.',
    )
  }

  const restoreBackup = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const backupFile =
      event.target.files?.[0]

    if (!backupFile) return

    try {
      const parsedData = JSON.parse(
        await backupFile.text(),
      ) as Partial<BackupData>

      if (!Array.isArray(parsedData.lessons)) {
        throw new Error('Invalid backup')
      }

      const validLessons =
        parsedData.lessons.filter(
          (
            lesson,
          ): lesson is Lesson =>
            Boolean(
              lesson &&
                typeof lesson.id ===
                  'number' &&
                typeof lesson.date ===
                  'string' &&
                typeof lesson.duration ===
                  'string' &&
                typeof lesson.roadType ===
                  'string' &&
                Array.isArray(
                  lesson.skills,
                ),
            ),
        )

      const confirmed =
        window.confirm(
          'Restore this backup? Your current confidence data and lesson history will be replaced.',
        )

      if (!confirmed) {
        event.target.value = ''
        return
      }

      setLessons(validLessons)
      setSelectedLessonId(null)
      setJustSavedLessonId(null)
      setEditingLessonId(null)
      setIsAddingMarker(false)

      if (
        parsedData.profile &&
        typeof parsedData.profile.name ===
          'string' &&
        parsedData.profile.name.trim() &&
        (parsedData.profile
          .transmission ===
          'Automatic' ||
          parsedData.profile
            .transmission === 'Manual')
      ) {
        const validAvatar =
          avatarChoices.some(
            (choice) =>
              choice.value ===
              parsedData.profile?.avatar,
          )

        onProfileChange({
          name:
            parsedData.profile.name.trim(),
          transmission:
            parsedData.profile
              .transmission,
          avatar: validAvatar
            ? parsedData.profile.avatar
            : 'initial',
          createdAt:
            typeof parsedData.profile
              .createdAt === 'number'
              ? parsedData.profile
                  .createdAt
              : Date.now(),
        })
      }

      const restoredConfidenceData =
        validLessons.some(
          (lesson) =>
            (lesson.skillAssessments
              ?.length ?? 0) > 0,
        )

      setBackupMessage(
        parsedData.progress &&
          !restoredConfidenceData
          ? 'Backup restored. Existing lessons were kept, but the old progress labels were not converted into confidence ratings.'
          : 'Backup restored successfully.',
      )

      setResetMessage('')
    } catch {
      setBackupMessage(
        'That file is not a valid JackTrack backup.',
      )
    }

    event.target.value = ''
  }

  const resetLearnerData = () => {
    const confirmation =
      window.prompt(
        `This will permanently delete all of ${profile.name}’s confidence ratings, practice flags, lesson history and routes.\n\nType RESET to continue.`,
      )

    if (confirmation === null) return

    if (
      confirmation
        .trim()
        .toUpperCase() !== 'RESET'
    ) {
      setResetMessage(
        'Reset cancelled because RESET was not entered correctly.',
      )
      return
    }

    setLessons([])
    setSelectedSkill(null)
    setSelectedLessonId(null)
    setJustSavedLessonId(null)
    setEditingLessonId(null)
    setIsAddingMarker(false)
    gpsRecorderRef.current?.discardRecording()
    setRecordedRoute([])
    setGpsDurationSeconds(0)
    setGpsDistanceMiles(0)
    setGpsCoverage(null)
    setLessonConfidenceDraft({})
    setLessonPracticeDraft({})
    setPracticeNoteSkillId(null)
    setPracticeNoteDraft('')
    setLessonSessionState('setup')
    setLessonSetupOpen(false)
    setPlannedLessonSkill(null)
    setBackupMessage('')

    setResetMessage(
      `${profile.name}’s learner data has been reset.`,
    )
  }

  const saveProfileChanges = () => {
    const cleanedName =
      profileName.trim()

    if (!cleanedName) {
      setProfileMessage(
        'Please enter the learner’s first name.',
      )
      return
    }

    onProfileChange({
      ...profile,
      name: cleanedName,
      transmission:
        profileTransmission,
      avatar: profileAvatar,
    })

    setIsEditingProfile(false)

    setProfileMessage(
      'Learner profile updated.',
    )
  }

  const cancelProfileEditing = () => {
    setProfileName(profile.name)

    setProfileTransmission(
      profile.transmission,
    )

    setProfileAvatar(profile.avatar)

    setProfileMessage('')
    setIsEditingProfile(false)
  }

  const navigateToLessonSummary = (
    lessonId: number,
  ) => {
    setSelectedLessonId(lessonId)
    setJustSavedLessonId(null)
    setEditingLessonId(null)
    setIsAddingMarker(false)
    setProgressView('overview')
    setActiveTab('progress')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const renderHome = () => (
    <>
      <header className="header">
        <div>
          <p className="welcome">
            Good afternoon, Jack
          </p>

          <h1>
            {profile.name}’s learning
            journey
          </h1>
        </div>

        <div className="avatar">
          <AvatarIcon
            avatar={profile.avatar}
            name={profile.name}
            className="avatar-svg"
          />
        </div>
      </header>

      <section className="progress-card">
        <div>
          <span className="badge">
            {profile.transmission} learner
          </span>

          <h2>Building confidence</h2>

          <p>
            {ratedSkillCount === 0
              ? 'Confidence ratings will build up after each recorded lesson.'
              : `${ratedSkillCount} of ${allSkills.length} skills rated${
                  averageConfidence !== null
                    ? ` · ${averageConfidence.toFixed(
                        1,
                      )}/5 average`
                    : ''
                }.`}
          </p>
        </div>

        <ProgressRing
          percentage={confidenceCoverage}
        />
      </section>

      <button
        className="start-button"
        onClick={openLessonHub}
      >
        <span>
          <strong>
            Start a lesson
          </strong>

          <small>
            Choose a guided focus or
            record an unguided drive
          </small>
        </span>

        <span>›</span>
      </button>

      <section className="section">
        <p className="section-label">
          Recommended next
        </p>

        <h2>{recommendedSkill.name}</h2>

        <button
          type="button"
          className="lesson-card lesson-summary-link"
          onClick={() =>
            planPracticeSession(
              recommendedSkill,
            )
          }
        >
          <span>
            <strong>
              Guided practice session
            </strong>

            <small>
              {recommendedReason}
            </small>
          </span>

          <span className="skill-chevron">
            ›
          </span>
        </button>
      </section>

      {lessons.length > 0 && (
        <section className="section">
          <p className="section-label">
            Latest lesson
          </p>

          <h2>
            {formatLessonDate(
              lessons[0].date,
            )}
          </h2>

          <button
            type="button"
            className="lesson-card lesson-summary-link"
            onClick={() =>
              navigateToLessonSummary(
                lessons[0].id,
              )
            }
          >
            <span>
              <strong>
                {lessons[0].duration}{' '}
                minutes ·{' '}
                {lessons[0].roadType}
              </strong>

              <small>
                {
                  lessons[0].skills
                    .length
                }{' '}
                skills practised
                {(lessons[0].route
                  ?.length ?? 0) > 0
                  ? ' · GPS route recorded'
                  : ''}
              </small>
            </span>

            <span className="skill-chevron">
              ›
            </span>
          </button>
        </section>
      )}
    </>
  )

  const renderSkillDetail = () => {
    if (!selectedSkill) return null

    const skillState =
      currentSkillState[selectedSkill.id]

    return (
      <section>
        <button
          className="text-button"
          onClick={() =>
            setSelectedSkill(null)
          }
        >
          ‹ Back to skills
        </button>

        <p className="section-label">
          Skill {selectedSkill.id} of{' '}
          {allSkills.length}
        </p>

        <h1>{selectedSkill.name}</h1>

        <div className="lesson-card confidence-current-card">
          <p className="section-label">
            Current learner confidence
          </p>

          <h3>
            {formatConfidence(
              skillState.confidence,
            )}
          </h3>

          <p>
            Confidence is updated from the
            reflection at the end of a
            recorded lesson.
          </p>

          {skillState.needsMorePractice && (
            <div className="practice-flag-summary">
              <strong>Needs more practice</strong>
              {skillState.note && (
                <span>{skillState.note}</span>
              )}
            </div>
          )}
        </div>

        <button
          className="start-button"
          type="button"
          onClick={() =>
            planPracticeSession(
              selectedSkill,
            )
          }
        >
          <span>
            <strong>
              Plan a practice session
            </strong>

            <small>
              Record a lesson and update
              confidence afterwards
            </small>
          </span>

          <span>›</span>
        </button>

        <SkillGuidancePanel
          skillId={selectedSkill.id}
          learner={profile}
        />
      </section>
    )
  }

  const renderSkills = () => {
    if (selectedSkill) {
      return renderSkillDetail()
    }

    return (
      <section>
        <p className="section-label">
          DVSA skills
        </p>

        <h1>Skills confidence</h1>

        <p>
          This is the learner’s current
          confidence picture from recorded
          lesson reflections. It is not a
          pass or fail score.
        </p>

        <div className="progress-stat-grid skills-stat-grid">
          <div>
            <strong>{ratedSkillCount}</strong>
            <span>rated</span>
          </div>

          <div>
            <strong>
              {averageConfidence === null
                ? '–'
                : averageConfidence.toFixed(1)}
            </strong>
            <span>avg / 5</span>
          </div>

          <div>
            <strong>
              {needsMorePracticeCount}
            </strong>
            <span>flagged</span>
          </div>
        </div>

        {skillGroups.map((group) => (
          <section
            className="skill-group"
            key={group.name}
          >
            <p className="section-label">
              {group.name}
            </p>

            {group.skills.map((skill) => {
              const skillState =
                currentSkillState[skill.id]

              return (
                <button
                  type="button"
                  className="lesson-card confidence-skill-row"
                  key={skill.id}
                  onClick={() =>
                    setSelectedSkill(skill)
                  }
                >
                  <span className="confidence-skill-copy">
                    <strong>
                      {skill.id}. {skill.name}
                    </strong>

                    <span className="confidence-skill-meta">
                      <ConfidenceMiniMeter
                        value={
                          skillState.confidence
                        }
                      />

                      <small>
                        {formatConfidence(
                          skillState.confidence,
                        )}
                      </small>
                    </span>

                    {skillState.needsMorePractice && (
                      <small className="needs-practice-inline">
                        Needs more practice
                        {skillState.note
                          ? ` · ${skillState.note}`
                          : ''}
                      </small>
                    )}
                  </span>

                  <span className="skill-chevron">
                    ›
                  </span>
                </button>
              )
            })}
          </section>
        ))}
      </section>
    )
  }

  const renderLesson = () => {
    if (!lessonSetupOpen) {
      const recommendedGuidance =
        skillGuidance[recommendedSkill.id]

      return (
        <section>
          <p className="section-label">
            Practice
          </p>

          <h1>Start a lesson</h1>

          <p>
            Choose what to focus on before
            the drive. Guided lessons include
            Instructor Mode throughout the
            session.
          </p>

          {lessonSaved && (
            <div className="lesson-card skills-summary">
              <h3>Lesson saved</h3>

              <p>
                The lesson has been saved on
                this device.
              </p>
            </div>
          )}

          <div className="lesson-card spaced-card">
            <p className="section-label">
              Recommended next lesson
            </p>

            <h2>
              {recommendedSkill.id}.{' '}
              {recommendedSkill.name}
            </h2>

            <p>
              {recommendedGuidance?.summary ??
                `Continue building confidence with ${recommendedSkill.name.toLowerCase()}.`}
            </p>

            <p>
              <strong>Confidence:</strong>{' '}
              {formatConfidence(
                recommendedSkillState.confidence,
              )}
            </p>

            <p>
              <strong>Why this lesson:</strong>{' '}
              {recommendedReason}
            </p>

            <p>
              <strong>Practice history:</strong>{' '}
              {recommendedPracticeHistory}
            </p>

            <button
              type="button"
              className="start-button"
              onClick={() =>
                planPracticeSession(
                  recommendedSkill,
                )
              }
            >
              <span>
                <strong>
                  Start recommended lesson
                </strong>

                <small>
                  Guided session · Instructor
                  Mode included
                </small>
              </span>

              <span>›</span>
            </button>
          </div>

          <div className="lesson-card spaced-card">
            <h3>Choose a skill to focus on</h3>

            <p>
              Pick any syllabus skill and
              JackTrack will build a guided
              practice session around it.
            </p>

            <button
              type="button"
              className="text-button full-text-button"
              onClick={() =>
                setIsChoosingLessonSkill(
                  (currentValue) =>
                    !currentValue,
                )
              }
            >
              {isChoosingLessonSkill
                ? 'Hide skill list'
                : 'Choose a skill'}
            </button>
          </div>

          {isChoosingLessonSkill &&
            skillGroups.map((group) => (
              <section
                className="skill-group"
                key={group.name}
              >
                <p className="section-label">
                  {group.name}
                </p>

                {group.skills.map(
                  (skill) => (
                    <div
                      className="lesson-card quick-skill-card"
                      key={skill.id}
                    >
                      <button
                        type="button"
                        className="quick-skill-name"
                        onClick={() =>
                          planPracticeSession(
                            skill,
                          )
                        }
                      >
                        <strong>
                          {skill.id}.{' '}
                          {skill.name}
                        </strong>

                        <small>
                          {formatConfidence(
                            currentSkillState[
                              skill.id
                            ].confidence,
                          )}
                          {' · '}Start guided
                          lesson
                        </small>
                      </button>

                      <span className="skill-chevron">
                        ›
                      </span>
                    </div>
                  ),
                )}
              </section>
            ))}

          <div className="lesson-card spaced-card">
            <p className="section-label">
              Flexible practice
            </p>

            <h3>Record an unguided lesson</h3>

            <p>
              Use this when you already know
              what you want to practise or
              you are going for an ad-hoc
              drive.
            </p>

            <button
              type="button"
              className="text-button full-text-button"
              onClick={startUnguidedLesson}
            >
              Record unguided lesson
            </button>
          </div>
        </section>
      )
    }

    return (
      <section>
        <button
          className="text-button"
          type="button"
          onClick={openLessonHub}
        >
          ‹ Back to lesson choices
        </button>

        <p className="section-label">
          {plannedLessonSkill
            ? 'Guided practice'
            : 'Unguided practice'}
        </p>

        <h1>
          {plannedLessonSkill
            ? plannedLessonSkill.name
            : 'Unguided lesson'}
        </h1>

        {lessonSessionState === 'setup' && (
          <p>
            Set up the lesson while safely
            parked. One press of Start lesson
            will begin both the lesson timer
            and GPS recording.
          </p>
        )}

        {lessonSessionState === 'active' && (
          <div className="lesson-card skills-summary">
            <p className="section-label">
              Live lesson
            </p>

            <h3>Lesson in progress</h3>

            <p>
              GPS and the lesson timer are
              running together. Keep
              JackTrack open and the screen
              unlocked. Only use the app when
              safely parked.
            </p>
          </div>
        )}

        {lessonSessionState === 'review' && (
          <div className="lesson-card skills-summary">
            <p className="section-label">
              Lesson finished
            </p>

            <h3>GPS has stopped</h3>

            <p>
              Review what happened, update
              the skills practised and save
              the lesson when ready.
            </p>
          </div>
        )}

        {lessonSessionState === 'setup' && (
          <>
            <button
              className="start-button"
              type="button"
              onClick={startLesson}
            >
              <span>
                <strong>Start lesson</strong>

                <small>
                  Starts the lesson timer and
                  GPS together
                </small>
              </span>

              <span>●</span>
            </button>

            <p className="lesson-plan-note">
              Start only when safely parked.
              There is no separate GPS start
              button.
            </p>
          </>
        )}

        {plannedLessonSkill && (
          <>
            <div className="lesson-card skills-summary">
              <p className="section-label">
                Main lesson focus
              </p>

              <h3>
                {plannedLessonSkill.id}.{' '}
                {plannedLessonSkill.name}
              </h3>

              <p>
                Instructor Mode below guides
                the practice session. Other
                skills can still be added to
                the record afterwards.
              </p>
            </div>

            <StructuredLessonPlan
              skillId={
                plannedLessonSkill.id
              }
              skillName={
                plannedLessonSkill.name
              }
              learner={profile}
              lessonStarted={
                lessonSessionState !== 'setup'
              }
            />
          </>
        )}

        <GpsRecorder
          ref={gpsRecorderRef}
          onRouteFinished={(
            route,
            durationSeconds,
            distanceMiles,
            coverage,
          ) => {
            setRecordedRoute(route)
            setGpsDurationSeconds(
              durationSeconds,
            )
            setGpsDistanceMiles(
              distanceMiles,
            )
            setGpsCoverage(coverage)
          }}
          onRecordingInterrupted={() => {
            setLessonSessionState('setup')
          }}
        />

        {lessonSessionState === 'active' && (
          <>
            <button
              className="start-button"
              type="button"
              onClick={finishLesson}
            >
              <span>
                <strong>Finish lesson</strong>

                <small>
                  Stops GPS and opens the
                  reflection before saving
                </small>
              </span>

              <span>■</span>
            </button>

            <p className="lesson-plan-note">
              Finish only when safely parked.
            </p>

            <button
              type="button"
              className="text-button gps-discard-button"
              onClick={discardCurrentLesson}
            >
              Discard current lesson
            </button>
          </>
        )}

        {lessonSessionState !== 'active' && (
          <>
            <div className="lesson-card spaced-card">
              <h3>Date</h3>

              <input
                className="progress-select"
                type="date"
                value={lessonDate}
                onChange={(event) =>
                  setLessonDate(
                    event.target.value,
                  )
                }
              />
            </div>

            {lessonSessionState ===
              'review' && (
              <div className="lesson-card spaced-card">
                <h3>
                  Duration in minutes
                </h3>

                <input
                  className="progress-select"
                  type="number"
                  min="1"
                  value={lessonDuration}
                  onChange={(event) =>
                    setLessonDuration(
                      event.target.value,
                    )
                  }
                />
              </div>
            )}

            <div className="lesson-card spaced-card">
              <h3>Road type</h3>

              <select
                className="progress-select"
                value={roadType}
                onChange={(event) =>
                  setRoadType(
                    event.target.value,
                  )
                }
              >
                {roadTypes.map((option) => (
                  <option key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="lesson-card spaced-card">
              <h3>Lesson objectives</h3>

              <textarea
                className="progress-select"
                rows={4}
                value={objectives}
                onChange={(event) =>
                  setObjectives(
                    event.target.value,
                  )
                }
              />
            </div>

          </>
        )}

        {lessonSessionState === 'review' && (
          <>
            <div className="lesson-card spaced-card">
              <h3>GPS summary</h3>

              <p>
                {recordedRoute.length} GPS
                points ·{' '}
                {gpsDistanceMiles.toFixed(
                  2,
                )}{' '}
                miles ·{' '}
                {formatGpsTime(
                  gpsDurationSeconds,
                )}
              </p>

              {gpsCoverage &&
                !gpsCoverage.isComplete && (
                  <div className="gps-coverage-warning">
                    <strong>
                      GPS coverage incomplete
                    </strong>

                    <p>
                      Tracking was interrupted
                      for about{' '}
                      {formatGpsInterruption(
                        gpsCoverage.interruptedSeconds,
                      )}
                      {gpsCoverage.gapCount > 0
                        ? ` across ${gpsCoverage.gapCount} ${
                            gpsCoverage.gapCount ===
                            1
                              ? 'gap'
                              : 'gaps'
                          }`
                        : ''}
                      . JackTrack kept missing
                      sections separate instead
                      of drawing a straight line.
                    </p>

                    <span>
                      {gpsCoverage.coveragePercent}%
                      GPS coverage
                    </span>
                  </div>
                )}

              {gpsCoverage?.isComplete && (
                <p className="gps-coverage-good">
                  GPS coverage looks complete
                  for this lesson.
                </p>
              )}
            </div>

            <div
              ref={reviewReflectionRef}
              className="lesson-card spaced-card"
            >
              <h3>What went well?</h3>

              <textarea
                className="progress-select"
                rows={4}
                value={wentWell}
                onChange={(event) =>
                  setWentWell(
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="lesson-card spaced-card">
              <h3>Skills practised</h3>

              <p>
                {plannedLessonSkill
                  ? 'The main focus is already selected. Add any other skills that came up during the drive.'
                  : 'Select the skills that were actually practised during this drive.'}
              </p>

              {allSkills.map((skill) => (
                <label
                  className="skill-checkbox"
                  key={skill.id}
                >
                  <input
                    type="checkbox"
                    checked={selectedLessonSkills.includes(
                      skill.id,
                    )}
                    onChange={() =>
                      toggleLessonSkill(
                        skill.id,
                      )
                    }
                  />

                  <span>
                    {skill.id}.{' '}
                    {skill.name}
                  </span>
                </label>
              ))}
            </div>

            {selectedLessonSkills.length > 0 && (
              <div className="lesson-card spaced-card">
                <p className="section-label">
                  Confidence after this lesson
                </p>

                <h3>How confident does {profile.name} feel?</h3>

                <p>
                  Rate only how confident the learner feels. The supervisor can separately flag anything that still needs more practice.
                </p>

                <div className="lesson-confidence-list">
                  {selectedLessonSkills.map(
                    (skillId) => {
                      const skill =
                        allSkills.find(
                          (candidate) =>
                            candidate.id ===
                            skillId,
                        )

                      if (!skill) return null

                      const currentPractice =
                        getLessonPractice(
                          skillId,
                        )

                      return (
                        <div
                          className="lesson-confidence-item"
                          key={skillId}
                        >
                          <div className="confidence-item-heading">
                            <div>
                              <strong>
                                {skill.id}.{' '}
                                {skill.name}
                              </strong>

                              <span>
                                Previous:{' '}
                                {formatConfidence(
                                  currentSkillState[
                                    skillId
                                  ].confidence,
                                )}
                              </span>
                            </div>
                          </div>

                          <ConfidenceSlider
                            value={getLessonConfidence(
                              skillId,
                            )}
                            onChange={(rating) =>
                              updateLessonConfidence(
                                skillId,
                                rating,
                              )
                            }
                            label={`${skill.name} confidence`}
                          />

                          <label className="needs-practice-check">
                            <input
                              type="checkbox"
                              checked={
                                currentPractice.needsMorePractice
                              }
                              onChange={(event) =>
                                setLessonNeedsMorePractice(
                                  skillId,
                                  event.target
                                    .checked,
                                )
                              }
                            />

                            <span>
                              <strong>
                                Needs more practice
                              </strong>
                              <small>
                                Supervisor flag
                              </small>
                            </span>
                          </label>

                          {currentPractice.note && (
                            <div className="practice-note-preview">
                              <strong>Supervisor note</strong>
                              <span>
                                {currentPractice.note}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setPracticeNoteSkillId(
                                    skillId,
                                  )
                                  setPracticeNoteDraft(
                                    currentPractice.note,
                                  )
                                }}
                              >
                                Edit note
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    },
                  )}
                </div>
              </div>
            )}

            <div className="lesson-card spaced-card">
              <h3>
                What needs more work?
              </h3>

              <textarea
                className="progress-select"
                rows={4}
                value={needsWork}
                onChange={(event) =>
                  setNeedsWork(
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="lesson-card spaced-card">
              <h3>
                Recommended next lesson
              </h3>

              <textarea
                className="progress-select"
                rows={3}
                value={nextLesson}
                onChange={(event) =>
                  setNextLesson(
                    event.target.value,
                  )
                }
              />
            </div>

            <button
              className="start-button"
              type="button"
              onClick={saveLesson}
            >
              <span>
                <strong>Save lesson</strong>

                <small>
                  Add this session and GPS
                  route to lesson history
                </small>
              </span>

              <span>✓</span>
            </button>

            <button
              type="button"
              className="text-button gps-discard-button"
              onClick={discardCurrentLesson}
            >
              Discard unsaved lesson
            </button>
          </>
        )}
      </section>
    )
  }

  const renderLessonEditor = (
    lesson: Lesson,
  ) => (
    <div className="lesson-card spaced-card">
      <h3>Edit lesson</h3>

      <p className="section-label">
        Date
      </p>

      <input
        className="progress-select"
        type="date"
        value={editDate}
        onChange={(event) =>
          setEditDate(event.target.value)
        }
      />

      <p className="section-label editor-label">
        Duration
      </p>

      <input
        className="progress-select"
        type="number"
        value={editDuration}
        onChange={(event) =>
          setEditDuration(
            event.target.value,
          )
        }
      />

      <p className="section-label editor-label">
        Road type
      </p>

      <select
        className="progress-select"
        value={editRoadType}
        onChange={(event) =>
          setEditRoadType(
            event.target.value,
          )
        }
      >
        {roadTypes.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>

      <p className="section-label editor-label">
        Objectives
      </p>

      <textarea
        className="progress-select"
        rows={3}
        value={editObjectives}
        onChange={(event) =>
          setEditObjectives(
            event.target.value,
          )
        }
      />

      <p className="section-label editor-label">
        Skills
      </p>

      {allSkills.map((skill) => (
        <label
          className="skill-checkbox"
          key={skill.id}
        >
          <input
            type="checkbox"
            checked={editSkills.includes(
              skill.id,
            )}
            onChange={() =>
              toggleEditSkill(skill.id)
            }
          />

          <span>{skill.name}</span>
        </label>
      ))}

      <p className="section-label editor-label">
        Went well
      </p>

      <textarea
        className="progress-select"
        rows={3}
        value={editWentWell}
        onChange={(event) =>
          setEditWentWell(
            event.target.value,
          )
        }
      />

      <p className="section-label editor-label">
        Needs work
      </p>

      <textarea
        className="progress-select"
        rows={3}
        value={editNeedsWork}
        onChange={(event) =>
          setEditNeedsWork(
            event.target.value,
          )
        }
      />

      <p className="section-label editor-label">
        Next lesson
      </p>

      <textarea
        className="progress-select"
        rows={3}
        value={editNextLesson}
        onChange={(event) =>
          setEditNextLesson(
            event.target.value,
          )
        }
      />

      <button
        className="start-button"
        type="button"
        onClick={saveEditedLesson}
      >
        <span>
          <strong>Save changes</strong>

          <small>
            Update this lesson
          </small>
        </span>

        <span>✓</span>
      </button>

      <button
        className="text-button full-text-button"
        type="button"
        onClick={() =>
          setEditingLessonId(null)
        }
      >
        Cancel editing
      </button>

      <button
        className="text-button delete-text-button"
        type="button"
        onClick={() =>
          deleteLesson(lesson)
        }
      >
        Delete lesson
      </button>
    </div>
  )

  const renderLessonSummary = () => {
    const lesson = lessons.find(
      (savedLesson) =>
        savedLesson.id ===
        selectedLessonId,
    )

    if (!lesson) {
      return (
        <section>
          <button
            className="text-button"
            onClick={() =>
              setSelectedLessonId(null)
            }
          >
            ‹ Back to lesson history
          </button>

          <h1>Lesson not found</h1>
        </section>
      )
    }

    if (
      editingLessonId === lesson.id
    ) {
      return (
        <section>
          <button
            className="text-button"
            onClick={() =>
              setEditingLessonId(null)
            }
          >
            ‹ Back to summary
          </button>

          {renderLessonEditor(lesson)}
        </section>
      )
    }

    const markers =
      lesson.reflectionMarkers ?? []

    const isJustSaved =
      justSavedLessonId === lesson.id

    const continueToProgress = () => {
      setSelectedLessonId(null)
      setJustSavedLessonId(null)
      setEditingLessonId(null)
      setIsAddingMarker(false)
      setProgressView('overview')

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    return (
      <section>
        <button
          className="text-button"
          onClick={() => {
            if (isJustSaved) {
              continueToProgress()
              return
            }

            setSelectedLessonId(null)
            setIsAddingMarker(false)
          }}
        >
          {isJustSaved
            ? '‹ Back to progress'
            : '‹ Back to lesson history'}
        </button>

        <p className="section-label">
          Lesson summary
        </p>

        <h1>
          {formatLessonDate(
            lesson.date,
          )}
        </h1>

        <div className="lesson-summary-stats">
          <div>
            <strong>
              {lesson.duration}
            </strong>

            <span>minutes</span>
          </div>

          <div>
            <strong>
              {lesson.skills.length}
            </strong>

            <span>skills</span>
          </div>

          <div>
            <strong>
              {(
                lesson.gpsDistanceMiles ??
                0
              ).toFixed(2)}
            </strong>

            <span>GPS miles</span>
          </div>
        </div>

        <div className="lesson-card spaced-card">
          <h3>Lesson details</h3>

          <p>
            <strong>Road type:</strong>{' '}
            {lesson.roadType}
          </p>

          {(lesson.route?.length ??
            0) > 0 && (
            <p>
              <strong>
                GPS recording:
              </strong>{' '}
              {formatGpsTime(
                lesson.gpsDurationSeconds ??
                  0,
              )}{' '}
              ·{' '}
              {lesson.route?.length ?? 0}{' '}
              points
            </p>
          )}

          {lesson.gpsCoverage &&
            !lesson.gpsCoverage.isComplete && (
              <div className="gps-coverage-warning">
                <strong>
                  GPS coverage incomplete
                </strong>

                <p>
                  Tracking was interrupted for
                  about{' '}
                  {formatGpsInterruption(
                    lesson.gpsCoverage
                      .interruptedSeconds,
                  )}
                  . The saved route keeps the
                  affected sections separate.
                </p>

                <span>
                  {lesson.gpsCoverage
                    .coveragePercent}% GPS
                  coverage
                </span>
              </div>
            )}
        </div>

        {(lesson.route?.length ??
          0) > 0 && (
          <div className="lesson-card spaced-card map-card">
            <div className="map-card-heading">
              <div>
                <h3>Lesson route</h3>

                <p>
                  Internet connection is
                  required to load the
                  map.
                </p>
              </div>

              <span className="reflection-count">
                {markers.length}{' '}
                reflections
              </span>
            </div>

            <RouteMap
              route={
                lesson.route ?? []
              }
              markers={markers}
              isAddingMarker={
                isAddingMarker
              }
              onAddMarker={
                addReflectionMarker
              }
            />

            <button
              type="button"
              className={
                isAddingMarker
                  ? 'marker-mode-button active'
                  : 'marker-mode-button'
              }
              onClick={() =>
                setIsAddingMarker(
                  (currentValue) =>
                    !currentValue,
                )
              }
            >
              {isAddingMarker
                ? 'Cancel adding marker'
                : 'Add reflection marker'}
            </button>

            {isAddingMarker && (
              <p className="marker-instruction">
                Tap the exact point on
                the route where the
                reflection happened.
              </p>
            )}
          </div>
        )}

        {markers.length > 0 && (
          <div className="lesson-card spaced-card">
            <h3>Route reflections</h3>

            <div className="reflection-list">
              {markers.map(
                (marker, index) => (
                  <div
                    className="reflection-item"
                    key={marker.id}
                  >
                    <div className="reflection-number">
                      {index + 1}
                    </div>

                    <div className="reflection-content">
                      <strong>
                        {marker.note}
                      </strong>

                      <span>
                        {marker.latitude.toFixed(
                          5,
                        )}
                        ,{' '}
                        {marker.longitude.toFixed(
                          5,
                        )}
                      </span>

                      <div className="reflection-actions">
                        <a
                          href={createStreetViewUrl(
                            marker,
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open Street View
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            deleteReflectionMarker(
                              lesson.id,
                              marker.id,
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            <p className="street-view-note">
              Street View requires an
              internet connection and
              may not be available at
              every location.
            </p>
          </div>
        )}

        {lesson.objectives && (
          <div className="lesson-card spaced-card">
            <h3>
              Lesson objectives
            </h3>

            <p>{lesson.objectives}</p>
          </div>
        )}

        <div className="lesson-card spaced-card">
          <h3>Skills practised</h3>

          {lesson.skills.length > 0 ? (
            <div className="lesson-assessment-summary-list">
              {lesson.skills.map(
                (skillId) => {
                  const assessment =
                    lesson.skillAssessments?.find(
                      (item) =>
                        item.skillId === skillId,
                    )

                  return (
                    <div
                      className="lesson-assessment-summary"
                      key={skillId}
                    >
                      <strong>
                        {skillId}.{' '}
                        {getSkillName(skillId)}
                      </strong>

                      {assessment ? (
                        <>
                          <span>
                            Confidence:{' '}
                            {assessment.confidenceBefore ===
                            assessment.confidenceAfter
                              ? formatConfidence(
                                  assessment.confidenceAfter,
                                )
                              : `${formatConfidence(
                                  assessment.confidenceBefore,
                                )} → ${formatConfidence(
                                  assessment.confidenceAfter,
                                )}`}
                          </span>

                          {assessment.needsMorePractice && (
                            <span className="needs-practice-inline">
                              Needs more practice
                            </span>
                          )}

                          {assessment.supervisorNote && (
                            <small>
                              {assessment.supervisorNote}
                            </small>
                          )}
                        </>
                      ) : (
                        <span>
                          Confidence not recorded for this older lesson
                        </span>
                      )}
                    </div>
                  )
                },
              )}
            </div>
          ) : (
            <p>
              No skills were selected
              for this lesson.
            </p>
          )}
        </div>

        {lesson.wentWell && (
          <div className="lesson-card spaced-card">
            <h3>What went well</h3>

            <p>{lesson.wentWell}</p>
          </div>
        )}

        {lesson.needsWork && (
          <div className="lesson-card spaced-card">
            <h3>
              What needs more work
            </h3>

            <p>{lesson.needsWork}</p>
          </div>
        )}

        {lesson.nextLesson && (
          <div className="lesson-card spaced-card">
            <h3>
              Recommended next lesson
            </h3>

            <p>{lesson.nextLesson}</p>
          </div>
        )}

        <div className="summary-actions">
          {isJustSaved ? (
            <button
              className="start-button"
              type="button"
              onClick={continueToProgress}
            >
              <span>
                <strong>
                  Continue to Progress
                </strong>

                <small>
                  See the updated confidence
                  and learning overview
                </small>
              </span>

              <span>›</span>
            </button>
          ) : (
            <>
              <button
                className="start-button"
                type="button"
                onClick={() =>
                  beginEditingLesson(
                    lesson,
                  )
                }
              >
                <span>
                  <strong>
                    Edit lesson
                  </strong>

                  <small>
                    Correct or update
                    lesson details
                  </small>
                </span>

                <span>›</span>
              </button>

              <button
                className="text-button delete-text-button"
                type="button"
                onClick={() =>
                  deleteLesson(lesson)
                }
              >
                Delete lesson
              </button>
            </>
          )}
        </div>
      </section>
    )
  }

  const renderProgress = () => {
    if (
      selectedLessonId !== null
    ) {
      return renderLessonSummary()
    }

    if (progressView === 'skills') {
      if (selectedSkill) {
        return renderSkillDetail()
      }

      return (
        <section>
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setSelectedSkill(null)
              setProgressView(
                'overview',
              )
            }}
          >
            ‹ Back to progress
          </button>

          {renderSkills()}
        </section>
      )
    }

    return (
      <section>
        <p className="section-label">
          Learning overview
        </p>

        <h1>Progress</h1>

        <p className="progress-intro">
          Use this page to spot where confidence
          is lowest, what the supervisor wants
          to revisit and which skills have not
          been rated yet.
        </p>

        <div className="progress-stat-grid">
          <div>
            <strong>{ratedSkillCount}</strong>
            <span>rated skills</span>
          </div>

          <div>
            <strong>
              {averageConfidence === null
                ? '–'
                : averageConfidence.toFixed(1)}
            </strong>
            <span>avg confidence</span>
          </div>

          <div>
            <strong>
              {needsMorePracticeCount}
            </strong>
            <span>need practice</span>
          </div>
        </div>

        <div className="lesson-card spaced-card confidence-coverage-card">
          <div className="confidence-coverage-heading">
            <div>
              <p className="section-label">
                Confidence picture
              </p>

              <h3>
                {confidenceCoverage}% rated
              </h3>
            </div>

            <strong>
              {ratedSkillCount}/{allSkills.length}
            </strong>
          </div>

          <div
            className="confidence-coverage-track"
            aria-label={`${confidenceCoverage}% of skills rated`}
          >
            <span
              style={{
                width: `${confidenceCoverage}%`,
              }}
            />
          </div>

          <p>
            Confidence is only added after a
            recorded lesson, so unrated skills
            stay genuinely unknown rather than
            being given a guessed score.
          </p>
        </div>

        {lowestConfidenceSkills.length > 0 && (
          <div className="lesson-card spaced-card progress-focus-card">
            <p className="section-label">
              Lowest confidence
            </p>

            <h3>Areas to build next</h3>

            <p>
              These are the lowest current
              learner confidence ratings. A
              supervisor flag is shown separately.
            </p>

            <div className="progress-focus-list">
              {lowestConfidenceSkills.map(
                (skill, index) => {
                  const skillState =
                    currentSkillState[skill.id]

                  return (
                    <button
                      type="button"
                      key={skill.id}
                      onClick={() => {
                        setSelectedSkill(skill)
                        setProgressView('skills')
                      }}
                    >
                      <span className="progress-focus-rank">
                        {index + 1}
                      </span>

                      <span className="progress-focus-copy">
                        <strong>
                          {skill.name}
                        </strong>

                        <span className="progress-focus-meter-row">
                          <ConfidenceMiniMeter
                            value={
                              skillState.confidence
                            }
                          />

                          <small>
                            {formatConfidence(
                              skillState.confidence,
                            )}
                          </small>
                        </span>

                        {skillState.needsMorePractice && (
                          <small className="needs-practice-inline">
                            Needs more practice
                          </small>
                        )}
                      </span>

                      <span className="skill-chevron">
                        ›
                      </span>
                    </button>
                  )
                },
              )}
            </div>
          </div>
        )}

        <div className="lesson-card spaced-card progress-practice-card">
          <div className="progress-card-heading-row">
            <div>
              <p className="section-label">
                Supervisor view
              </p>

              <h3>Needs more practice</h3>
            </div>

            <span className="progress-count-pill">
              {needsMorePracticeSkills.length}
            </span>
          </div>

          {needsMorePracticeSkills.length > 0 ? (
            <div className="practice-focus-list">
              {needsMorePracticeSkills.map(
                (skill) => {
                  const skillState =
                    currentSkillState[skill.id]

                  return (
                    <button
                      type="button"
                      key={skill.id}
                      onClick={() => {
                        setSelectedSkill(skill)
                        setProgressView('skills')
                      }}
                    >
                      <span>
                        <strong>
                          {skill.name}
                        </strong>

                        <small>
                          {formatConfidence(
                            skillState.confidence,
                          )}
                        </small>

                        {skillState.note && (
                          <small className="practice-focus-note">
                            “{skillState.note}”
                          </small>
                        )}
                      </span>

                      <span className="skill-chevron">
                        ›
                      </span>
                    </button>
                  )
                },
              )}
            </div>
          ) : (
            <p className="progress-empty-copy">
              Nothing is currently flagged by the
              supervisor. Flags can be added during
              the reflection after a lesson.
            </p>
          )}
        </div>

        <div className="lesson-card spaced-card unrated-skills-card">
          <div className="progress-card-heading-row">
            <div>
              <p className="section-label">
                Still to assess
              </p>

              <h3>Not yet rated</h3>
            </div>

            <span className="progress-count-pill neutral">
              {notYetRatedSkills.length}
            </span>
          </div>

          {notYetRatedSkills.length > 0 ? (
            <>
              <p>
                These skills do not have a learner
                confidence rating yet.
              </p>

              <div className="unrated-skill-chips">
                {notYetRatedSkills
                  .slice(0, 6)
                  .map((skill) => (
                    <button
                      type="button"
                      key={skill.id}
                      onClick={() => {
                        setSelectedSkill(skill)
                        setProgressView('skills')
                      }}
                    >
                      {skill.name}
                    </button>
                  ))}

                {notYetRatedSkills.length > 6 && (
                  <span>
                    +{notYetRatedSkills.length - 6} more
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="progress-empty-copy">
              Every skill now has a confidence
              rating.
            </p>
          )}
        </div>

        <button
          type="button"
          className="lesson-card lesson-summary-link spaced-card skills-overview-link"
          onClick={() =>
            setProgressView('skills')
          }
        >
          <span>
            <strong>
              View all 27 skills
            </strong>

            <small>
              Open the full confidence picture,
              supervisor flags and guidance
            </small>
          </span>

          <span className="skill-chevron">
            ›
          </span>
        </button>

        <section className="section lesson-history-section">
          <div className="history-section-heading">
            <div>
              <p className="section-label">
                Lesson history
              </p>

              <h2>Previous lessons</h2>
            </div>

            <span>
              {lessons.length} saved
            </span>
          </div>

          {lessons.length > 0 ? (
            lessons.map((lesson) => {
              const primarySkillId =
                lesson.primarySkillId ??
                lesson.skills[0]

              const primarySkillName =
                primarySkillId
                  ? getSkillName(
                      primarySkillId,
                    )
                  : null

              const primaryAssessment =
                primarySkillId
                  ? lesson.skillAssessments?.find(
                      (assessment) =>
                        assessment.skillId ===
                        primarySkillId,
                    )
                  : undefined

              const otherSkills =
                lesson.skills.filter(
                  (skillId) =>
                    skillId !== primarySkillId,
                )

              const otherSkillNames =
                otherSkills
                  .slice(0, 2)
                  .map((skillId) =>
                    getSkillName(skillId),
                  )

              const confidenceLine =
                primaryAssessment
                  ? primaryAssessment.confidenceBefore ===
                      null &&
                    primaryAssessment.confidenceAfter !==
                      null
                    ? `First rating: ${formatConfidence(
                        primaryAssessment.confidenceAfter,
                      )}`
                    : primaryAssessment.confidenceBefore ===
                        primaryAssessment.confidenceAfter
                      ? `Confidence: ${formatConfidence(
                          primaryAssessment.confidenceAfter,
                        )}`
                      : `Confidence: ${formatConfidence(
                          primaryAssessment.confidenceBefore,
                        )} → ${formatConfidence(
                          primaryAssessment.confidenceAfter,
                        )}`
                  : null

              return (
                <button
                  type="button"
                  className="lesson-card lesson-history-card"
                  key={lesson.id}
                  onClick={() =>
                    navigateToLessonSummary(
                      lesson.id,
                    )
                  }
                >
                  <div className="lesson-history-card-top">
                    <div>
                      <span className="lesson-type-pill">
                        {lesson.lessonType ??
                          (lesson.primarySkillId
                            ? 'Guided'
                            : 'Recorded')}
                      </span>

                      <strong>
                        {primarySkillName ??
                          'Unguided practice'}
                      </strong>
                    </div>

                    <span className="skill-chevron">
                      ›
                    </span>
                  </div>

                  <div className="lesson-history-meta">
                    <span>
                      {formatLessonDate(
                        lesson.date,
                      )}
                    </span>
                    <span>
                      {lesson.duration} min
                    </span>
                    {(lesson.route?.length ?? 0) > 0 && (
                      <span>
                        {(
                          lesson.gpsDistanceMiles ??
                          0
                        ).toFixed(2)}{' '}
                        miles
                      </span>
                    )}
                  </div>

                  {primaryAssessment && (
                    <div className="lesson-history-confidence">
                      <ConfidenceMiniMeter
                        value={
                          primaryAssessment.confidenceAfter
                        }
                      />

                      <span>
                        {confidenceLine}
                      </span>
                    </div>
                  )}

                  {primaryAssessment?.needsMorePractice && (
                    <div className="lesson-history-flag">
                      <strong>
                        Needs more practice
                      </strong>

                      {primaryAssessment.supervisorNote && (
                        <span>
                          {primaryAssessment.supervisorNote}
                        </span>
                      )}
                    </div>
                  )}

                  {otherSkillNames.length > 0 && (
                    <small className="lesson-history-extra-skills">
                      Also practised:{' '}
                      {otherSkillNames.join(', ')}
                      {otherSkills.length > 2
                        ? ` +${otherSkills.length - 2} more`
                        : ''}
                    </small>
                  )}

                  {lesson.nextLesson && (
                    <small className="lesson-history-next">
                      <strong>Next:</strong>{' '}
                      {lesson.nextLesson}
                    </small>
                  )}
                </button>
              )
            })
          ) : (
            <div className="lesson-card progress-empty-card">
              <h3>No lessons recorded yet</h3>
              <p>
                Confidence and lesson history will
                build automatically after the first
                recorded lesson is saved.
              </p>
            </div>
          )}
        </section>
      </section>
    )
  }

  const renderProfileEditor = () => (
    <div className="lesson-card spaced-card">
      <h3>Edit learner profile</h3>

      <p className="section-label editor-label">
        First name
      </p>

      <input
        className="progress-select"
        type="text"
        maxLength={40}
        value={profileName}
        onChange={(event) => {
          setProfileName(
            event.target.value,
          )

          setProfileMessage('')
        }}
      />

      <fieldset className="setup-field setup-options">
        <legend>Learning in</legend>

        <label
          className={
            profileTransmission ===
            'Automatic'
              ? 'setup-option selected'
              : 'setup-option'
          }
        >
          <input
            type="radio"
            name="edit-transmission"
            checked={
              profileTransmission ===
              'Automatic'
            }
            onChange={() =>
              setProfileTransmission(
                'Automatic',
              )
            }
          />

          <span>
            <strong>Automatic</strong>

            <small>
              No clutch pedal or manual
              gear changes
            </small>
          </span>
        </label>

        <label
          className={
            profileTransmission ===
            'Manual'
              ? 'setup-option selected'
              : 'setup-option'
          }
        >
          <input
            type="radio"
            name="edit-transmission"
            checked={
              profileTransmission ===
              'Manual'
            }
            onChange={() =>
              setProfileTransmission(
                'Manual',
              )
            }
          />

          <span>
            <strong>Manual</strong>

            <small>
              Includes clutch control
              and gear changes
            </small>
          </span>
        </label>
      </fieldset>

      <fieldset className="setup-field avatar-options">
        <legend>Avatar</legend>

        <div className="avatar-choice-grid">
          {avatarChoices.map(
            (choice) => {
              return (
                <label
                  className={
                    profileAvatar ===
                    choice.value
                      ? 'avatar-choice selected'
                      : 'avatar-choice'
                  }
                  key={choice.value}
                >
                  <input
                    type="radio"
                    name="edit-avatar"
                    checked={
                      profileAvatar ===
                      choice.value
                    }
                    onChange={() =>
                      setProfileAvatar(
                        choice.value,
                      )
                    }
                  />

                  <span className="avatar-choice-symbol">
                    <AvatarIcon
                      avatar={choice.value}
                      name={
                        profileName.trim() ||
                        profile.name
                      }
                      className="avatar-svg"
                    />
                  </span>

                  <span className="avatar-choice-label">
                    {choice.label}
                  </span>
                </label>
              )
            },
          )}
        </div>
      </fieldset>

      {profileMessage && (
        <p className="setting-message">
          {profileMessage}
        </p>
      )}

      <button
        className="start-button"
        type="button"
        onClick={saveProfileChanges}
      >
        <span>
          <strong>
            Save profile
          </strong>

          <small>
            Update learner details
          </small>
        </span>

        <span>✓</span>
      </button>

      <button
        className="text-button full-text-button"
        type="button"
        onClick={cancelProfileEditing}
      >
        Cancel
      </button>
    </div>
  )

  const renderMore = () => (
    <section>
      <p className="section-label">
        JackTrack
      </p>

      <h1>More</h1>

      <div className="lesson-card">
        <h3>Learner</h3>

        <p>
          {profile.name} ·{' '}
          {profile.transmission} car
        </p>

        <button
          className="text-button full-text-button"
          type="button"
          onClick={() => {
            setProfileName(
              profile.name,
            )

            setProfileTransmission(
              profile.transmission,
            )

            setProfileAvatar(
              profile.avatar,
            )

            setProfileMessage('')
            setIsEditingProfile(true)
          }}
        >
          Edit learner profile
        </button>
      </div>

      {isEditingProfile &&
        renderProfileEditor()}

      {!isEditingProfile &&
        profileMessage && (
          <p className="setting-message">
            {profileMessage}
          </p>
        )}

      <div className="lesson-card spaced-card">
        <h3>Offline saving</h3>

        <p>
          Confidence ratings, lessons, GPS
          routes and reflection markers are
          stored on this device.
          Internet is only required for
          maps and Street View.
        </p>
      </div>

      <div className="lesson-card spaced-card">
        <h3>Backup and restore</h3>

        <button
          className="start-button"
          type="button"
          onClick={exportBackup}
        >
          <span>
            <strong>
              Download backup
            </strong>

            <small>
              Save all learner data and
              profile details
            </small>
          </span>

          <span>↓</span>
        </button>

        <label className="start-button restore-label">
          <span>
            <strong>
              Restore backup
            </strong>

            <small>
              Choose a JackTrack backup
            </small>
          </span>

          <span>↑</span>

          <input
            type="file"
            accept=".json,application/json"
            onChange={restoreBackup}
            hidden
          />
        </label>

        {backupMessage && (
          <p className="setting-message">
            {backupMessage}
          </p>
        )}
      </div>

      <div className="lesson-card spaced-card danger-card">
        <h3>
          Reset learner data
        </h3>

        <p>
          Permanently delete all
          confidence ratings, practice flags,
          lessons, routes and reflection
          markers for{' '}
          {profile.name}. The learner
          profile itself will remain.
        </p>

        <button
          className="danger-button"
          type="button"
          onClick={resetLearnerData}
        >
          Reset {profile.name}’s data
        </button>

        {resetMessage && (
          <p className="setting-message">
            {resetMessage}
          </p>
        )}
      </div>
    </section>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHome()

      case 'lesson':
        return renderLesson()

      case 'progress':
        return renderProgress()

      case 'more':
        return renderMore()
    }
  }

  const changeTab = (tab: Tab) => {
    if (tab === activeTab) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      return
    }

    if (
      activeTab === 'lesson' &&
      lessonSetupOpen &&
      !confirmLeaveUnsavedLesson()
    ) {
      return
    }

    setActiveTab(tab)
    setSelectedSkill(null)
    setIsAddingMarker(false)

    if (tab === 'lesson') {
      setLessonSetupOpen(false)
      setIsChoosingLessonSkill(false)
      setPlannedLessonSkill(null)
      setLessonSessionState('setup')
    }

    if (tab === 'progress') {
      setProgressView('overview')
    } else {
      setSelectedLessonId(null)
      setJustSavedLessonId(null)
    }

    window.scrollTo({
      top: 0,
    })
  }

  return (
    <main className="app">
      {renderContent()}

      {practiceNoteSkillId !== null && (
        <div
          className="practice-note-backdrop"
          role="presentation"
        >
          <div
            className="practice-note-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="practice-note-title"
          >
            <p className="section-label">
              Supervisor flag
            </p>

            <h2 id="practice-note-title">
              Add a comment?
            </h2>

            <p>
              You marked{' '}
              <strong>
                {getSkillName(
                  practiceNoteSkillId,
                )}
              </strong>{' '}
              as needing more practice. Add an
              optional note about what to focus
              on next time.
            </p>

            <textarea
              className="progress-select"
              rows={4}
              autoFocus
              placeholder="e.g. Hesitates when choosing gaps on larger roundabouts"
              value={practiceNoteDraft}
              onChange={(event) =>
                setPracticeNoteDraft(
                  event.target.value,
                )
              }
            />

            <button
              className="start-button"
              type="button"
              onClick={savePracticeNote}
            >
              <span>
                <strong>Save note</strong>
                <small>
                  Keep this with the skill
                  assessment
                </small>
              </span>
              <span>✓</span>
            </button>

            <button
              type="button"
              className="text-button full-text-button"
              onClick={skipPracticeNote}
            >
              Skip note
            </button>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        {(
          [
            ['home', 'Home'],
            ['lesson', 'Lesson'],
            ['progress', 'Progress'],
            ['more', 'More'],
          ] as [Tab, string][]
        ).map(([tab, label]) => (
          <button
            key={tab}
            className={
              activeTab === tab
                ? 'active'
                : ''
            }
            onClick={() =>
              changeTab(tab)
            }
          >
            {label}
          </button>
        ))}
      </nav>
    </main>
  )
}

export default App