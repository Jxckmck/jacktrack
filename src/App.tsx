import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import './App.css'
import GpsRecorder from './GpsRecorder'
import type { RoutePoint } from './GpsRecorder'
import RouteMap from './RouteMap'

type Tab = 'home' | 'skills' | 'lesson' | 'progress' | 'more'

type ProgressLevel =
  | 'Not started'
  | 'Introduced'
  | 'Helped'
  | 'Prompted'
  | 'Independent'
  | 'Reflection'

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
  wentWell: string
  needsWork: string
  nextLesson: string
  route?: RoutePoint[]
  gpsDurationSeconds?: number
  gpsDistanceMiles?: number
}

type SavedData = {
  progress: Record<number, ProgressLevel>
  lessons: Lesson[]
}

const STORAGE_KEY = 'jacktrack-data-v1'

const progressLevels: ProgressLevel[] = [
  'Not started',
  'Introduced',
  'Helped',
  'Prompted',
  'Independent',
  'Reflection',
]

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
      { id: 1, name: 'Legal responsibilities' },
      { id: 2, name: 'Safety checks' },
      {
        id: 3,
        name: 'Cockpit checks',
        automaticNote:
          'Check the parking brake is applied and the selector is in P before starting.',
      },
      { id: 4, name: 'Security' },
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
      { id: 7, name: 'Safe positioning' },
    ],
  },
  {
    name: '3. Observations, signalling and planning',
    skills: [
      { id: 8, name: 'Mirrors – vision and use' },
      { id: 9, name: 'Signals' },
      { id: 10, name: 'Anticipation and planning' },
      { id: 11, name: 'Use of speed' },
      { id: 12, name: 'Other traffic' },
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
      { id: 14, name: 'Junctions' },
      { id: 15, name: 'Roundabouts' },
      { id: 16, name: 'Pedestrian crossings' },
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
      { id: 21, name: 'Country roads' },
      { id: 22, name: 'Dual carriageways' },
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
      { id: 24, name: 'Driving in the dark' },
      { id: 25, name: 'Weather conditions' },
      { id: 26, name: 'Passengers and loads' },
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

const allSkills = skillGroups.flatMap((group) => group.skills)

const createDefaultProgress = (): Record<number, ProgressLevel> => {
  const defaultProgress: Record<number, ProgressLevel> = {}

  allSkills.forEach((skill) => {
    defaultProgress[skill.id] = 'Not started'
  })

  return defaultProgress
}

const loadSavedData = (): SavedData => {
  const defaultData: SavedData = {
    progress: createDefaultProgress(),
    lessons: [],
  }

  try {
    const savedData = localStorage.getItem(STORAGE_KEY)

    if (!savedData) return defaultData

    const parsedData = JSON.parse(savedData) as Partial<SavedData>

    return {
      progress: {
        ...defaultData.progress,
        ...(parsedData.progress ?? {}),
      },
      lessons: Array.isArray(parsedData.lessons)
        ? parsedData.lessons
        : [],
    }
  } catch {
    return defaultData
  }
}

const formatLessonDate = (date: string) => {
  const parsedDate = new Date(`${date}T12:00:00`)

  return parsedDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatGpsTime = (seconds = 0) => {
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

const getSkillName = (skillId: number) =>
  allSkills.find((skill) => skill.id === skillId)?.name ??
  `Skill ${skillId}`

function getProgressColour(percentage: number) {
  if (percentage < 40) return '#dc2626'
  if (percentage < 75) return '#f59e0b'
  return '#16a34a'
}

function ProgressRing({ percentage }: { percentage: number }) {
  const radius = 43
  const circumference = 2 * Math.PI * radius
  const progressLength = (percentage / 100) * circumference
  const progressColour = getProgressColour(percentage)

  return (
    <div
      className="jt-progress-ring"
      aria-label={`${percentage}% complete`}
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
          stroke={progressColour}
          strokeDasharray={`${progressLength} ${
            circumference - progressLength
          }`}
        />
      </svg>

      <div className="progress-circle-label">
        <strong style={{ color: progressColour }}>
          {percentage}%
        </strong>
        <span>complete</span>
      </div>
    </div>
  )
}

function App() {
  const initialData = loadSavedData()

  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [selectedSkill, setSelectedSkill] =
    useState<DrivingSkill | null>(null)
  const [selectedLessonId, setSelectedLessonId] =
    useState<number | null>(null)

  const [progress, setProgress] =
    useState<Record<number, ProgressLevel>>(initialData.progress)

  const [lessons, setLessons] =
    useState<Lesson[]>(initialData.lessons)

  const [lessonDate, setLessonDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [lessonDuration, setLessonDuration] = useState('')
  const [roadType, setRoadType] =
    useState('Quiet residential roads')
  const [objectives, setObjectives] = useState('')
  const [selectedLessonSkills, setSelectedLessonSkills] =
    useState<number[]>([])
  const [wentWell, setWentWell] = useState('')
  const [needsWork, setNeedsWork] = useState('')
  const [nextLesson, setNextLesson] = useState('')
  const [lessonSaved, setLessonSaved] = useState(false)

  const [recordedRoute, setRecordedRoute] =
    useState<RoutePoint[]>([])
  const [gpsDurationSeconds, setGpsDurationSeconds] =
    useState(0)
  const [gpsDistanceMiles, setGpsDistanceMiles] =
    useState(0)

  const [backupMessage, setBackupMessage] = useState('')
  const [resetMessage, setResetMessage] = useState('')

  const [editingLessonId, setEditingLessonId] =
    useState<number | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editDuration, setEditDuration] = useState('')
  const [editRoadType, setEditRoadType] = useState('')
  const [editObjectives, setEditObjectives] = useState('')
  const [editSkills, setEditSkills] = useState<number[]>([])
  const [editWentWell, setEditWentWell] = useState('')
  const [editNeedsWork, setEditNeedsWork] = useState('')
  const [editNextLesson, setEditNextLesson] = useState('')

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        progress,
        lessons,
      }),
    )
  }, [progress, lessons])

  const completedSkills = Object.values(progress).filter(
    (level) =>
      level === 'Independent' || level === 'Reflection',
  ).length

  const overallProgress = Math.round(
    (completedSkills / allSkills.length) * 100,
  )

  const updateProgress = (
    skillId: number,
    level: ProgressLevel,
  ) => {
    setProgress((currentProgress) => ({
      ...currentProgress,
      [skillId]: level,
    }))
  }

  const toggleLessonSkill = (skillId: number) => {
    setSelectedLessonSkills((currentSkills) =>
      currentSkills.includes(skillId)
        ? currentSkills.filter((id) => id !== skillId)
        : [...currentSkills, skillId],
    )
  }

  const toggleEditSkill = (skillId: number) => {
    setEditSkills((currentSkills) =>
      currentSkills.includes(skillId)
        ? currentSkills.filter((id) => id !== skillId)
        : [...currentSkills, skillId],
    )
  }

  const saveLesson = () => {
    if (!lessonDuration.trim()) {
      window.alert('Please enter the lesson duration.')
      return
    }

    const newLesson: Lesson = {
      id: Date.now(),
      date: lessonDate,
      duration: lessonDuration,
      roadType,
      objectives,
      skills: selectedLessonSkills,
      wentWell,
      needsWork,
      nextLesson,
      route: recordedRoute,
      gpsDurationSeconds,
      gpsDistanceMiles,
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
    setWentWell('')
    setNeedsWork('')
    setNextLesson('')
    setRecordedRoute([])
    setGpsDurationSeconds(0)
    setGpsDistanceMiles(0)
  }

  const deleteLesson = (lesson: Lesson) => {
    const confirmed = window.confirm(
      `Delete the lesson from ${formatLessonDate(
        lesson.date,
      )}? This cannot be undone.`,
    )

    if (!confirmed) return

    setLessons((currentLessons) =>
      currentLessons.filter(
        (savedLesson) => savedLesson.id !== lesson.id,
      ),
    )

    setEditingLessonId(null)

    if (selectedLessonId === lesson.id) {
      setSelectedLessonId(null)
    }
  }

  const beginEditingLesson = (lesson: Lesson) => {
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
      window.alert('Please enter the lesson duration.')
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
              wentWell: editWentWell,
              needsWork: editNeedsWork,
              nextLesson: editNextLesson,
            }
          : lesson,
      ),
    )

    setEditingLessonId(null)
  }

  const exportBackup = () => {
    const fileContents = JSON.stringify(
      {
        progress,
        lessons,
      },
      null,
      2,
    )

    const fileBlob = new Blob([fileContents], {
      type: 'application/json',
    })

    const downloadUrl = URL.createObjectURL(fileBlob)
    const downloadLink = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)

    downloadLink.href = downloadUrl
    downloadLink.download =
      `jacktrack-emily-backup-${date}.json`

    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    URL.revokeObjectURL(downloadUrl)

    setBackupMessage('Backup downloaded successfully.')
  }

  const restoreBackup = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const backupFile = event.target.files?.[0]

    if (!backupFile) return

    try {
      const parsedData = JSON.parse(
        await backupFile.text(),
      ) as Partial<SavedData>

      if (
        !parsedData.progress ||
        typeof parsedData.progress !== 'object' ||
        !Array.isArray(parsedData.lessons)
      ) {
        throw new Error('Invalid backup')
      }

      const restoredProgress = createDefaultProgress()

      allSkills.forEach((skill) => {
        const restoredLevel = parsedData.progress?.[skill.id]

        if (
          restoredLevel &&
          progressLevels.includes(restoredLevel)
        ) {
          restoredProgress[skill.id] = restoredLevel
        }
      })

      const validLessons = parsedData.lessons.filter(
        (lesson): lesson is Lesson =>
          Boolean(
            lesson &&
              typeof lesson.id === 'number' &&
              typeof lesson.date === 'string' &&
              typeof lesson.duration === 'string' &&
              typeof lesson.roadType === 'string' &&
              Array.isArray(lesson.skills),
          ),
      )

      const confirmed = window.confirm(
        'Restore this backup? Your current progress and lesson history will be replaced.',
      )

      if (!confirmed) {
        event.target.value = ''
        return
      }

      setProgress(restoredProgress)
      setLessons(validLessons)
      setSelectedLessonId(null)
      setEditingLessonId(null)
      setBackupMessage('Backup restored successfully.')
      setResetMessage('')
    } catch {
      setBackupMessage(
        'That file is not a valid JackTrack backup.',
      )
    }

    event.target.value = ''
  }

  const resetLearnerData = () => {
    const confirmation = window.prompt(
      'This will permanently delete all of Emily’s skill progress, lesson history and routes.\n\nType RESET to continue.',
    )

    if (confirmation === null) return

    if (confirmation.trim().toUpperCase() !== 'RESET') {
      setResetMessage(
        'Reset cancelled because RESET was not entered correctly.',
      )
      return
    }

    setProgress(createDefaultProgress())
    setLessons([])
    setSelectedSkill(null)
    setSelectedLessonId(null)
    setEditingLessonId(null)
    setRecordedRoute([])
    setGpsDurationSeconds(0)
    setGpsDistanceMiles(0)
    setBackupMessage('')
    setResetMessage('Emily’s learner data has been reset.')
  }

  const navigateToLessonSummary = (lessonId: number) => {
    setSelectedLessonId(lessonId)
    setEditingLessonId(null)
    setActiveTab('progress')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderHome = () => (
    <>
      <header className="header">
        <div>
          <p className="welcome">Good afternoon, Jack</p>
          <h1>Emily’s learning journey</h1>
        </div>

        <div className="avatar">E</div>
      </header>

      <section className="progress-card">
        <div>
          <span className="badge">Automatic learner</span>
          <h2>Building confidence</h2>
          <p>Keep each session calm, focused and consistent.</p>
        </div>

        <ProgressRing percentage={overallProgress} />
      </section>

      <button
        className="start-button"
        onClick={() => setActiveTab('lesson')}
      >
        <span>
          <strong>Start a lesson</strong>
          <small>Plan objectives and record the drive</small>
        </span>

        <span>›</span>
      </button>

      <section className="section">
        <p className="section-label">Recommended next</p>
        <h2>Moving off safely</h2>

        <div className="lesson-card">
          <h3>Quiet-road control session</h3>
          <p>
            Practise observations, smooth brake release and
            controlled stopping.
          </p>
          <span>30–40 minutes</span>
        </div>
      </section>

      {lessons.length > 0 && (
        <section className="section">
          <p className="section-label">Latest lesson</p>
          <h2>{formatLessonDate(lessons[0].date)}</h2>

          <button
            type="button"
            className="lesson-card lesson-summary-link"
            onClick={() =>
              navigateToLessonSummary(lessons[0].id)
            }
          >
            <span>
              <strong>
                {lessons[0].duration} minutes ·{' '}
                {lessons[0].roadType}
              </strong>

              <small>
                {lessons[0].skills.length} skills practised
                {(lessons[0].route?.length ?? 0) > 0
                  ? ' · GPS route recorded'
                  : ''}
              </small>
            </span>

            <span className="skill-chevron">›</span>
          </button>
        </section>
      )}
    </>
  )

  const renderSkillDetail = () => {
    if (!selectedSkill) return null

    return (
      <section>
        <button
          className="text-button"
          onClick={() => setSelectedSkill(null)}
        >
          ‹ Back to skills
        </button>

        <p className="section-label">
          Skill {selectedSkill.id} of {allSkills.length}
        </p>

        <h1>{selectedSkill.name}</h1>

        <div className="lesson-card">
          <h3>Current progress</h3>

          <select
            className="progress-select"
            value={progress[selectedSkill.id]}
            onChange={(event) =>
              updateProgress(
                selectedSkill.id,
                event.target.value as ProgressLevel,
              )
            }
          >
            {progressLevels.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </div>

        {selectedSkill.automaticNote && (
          <div className="lesson-card spaced-card">
            <h3>Automatic-car guidance</h3>
            <p>{selectedSkill.automaticNote}</p>
          </div>
        )}

        <div className="lesson-card spaced-card">
          <h3>Teacher watch-outs</h3>
          <p>
            Watch for rushed observations, excessive prompting and
            habits that prevent Emily from making her own decisions.
          </p>
        </div>

        <div className="lesson-card spaced-card">
          <h3>Ready to progress when</h3>
          <p>
            Emily can demonstrate the skill safely and consistently
            in different situations with progressively less help.
          </p>
        </div>
      </section>
    )
  }

  const renderSkills = () => {
    if (selectedSkill) return renderSkillDetail()

    return (
      <section>
        <p className="section-label">Official DVSA record</p>
        <h1>Driving skills</h1>

        <p>
          Update progress directly from the list, or open a skill for
          full guidance.
        </p>

        <div className="lesson-card skills-summary">
          <h3>
            {completedSkills} of {allSkills.length} independently
            achieved
          </h3>

          <p>
            Skills count towards completion at Independent or
            Reflection.
          </p>
        </div>

        {skillGroups.map((group) => (
          <section className="skill-group" key={group.name}>
            <p className="section-label">{group.name}</p>

            {group.skills.map((skill) => (
              <div
                className="lesson-card quick-skill-card"
                key={skill.id}
              >
                <button
                  type="button"
                  className="quick-skill-name"
                  onClick={() => setSelectedSkill(skill)}
                >
                  <strong>
                    {skill.id}. {skill.name}
                  </strong>

                  <small>Tap for guidance</small>
                </button>

                <select
                  className="progress-select quick-progress-select"
                  value={progress[skill.id]}
                  onChange={(event) =>
                    updateProgress(
                      skill.id,
                      event.target.value as ProgressLevel,
                    )
                  }
                >
                  {progressLevels.map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </select>
              </div>
            ))}
          </section>
        ))}
      </section>
    )
  }

  const renderLesson = () => (
    <section>
      <p className="section-label">Private practice</p>
      <h1>Record a lesson</h1>

      <p>
        Set this up before driving, then complete the reflection once
        safely parked.
      </p>

      {lessonSaved && (
        <div className="lesson-card skills-summary">
          <h3>Lesson saved</h3>
          <p>Your lesson has been saved on this device.</p>
        </div>
      )}

      <GpsRecorder
        onRouteFinished={(
          route,
          durationSeconds,
          distanceMiles,
        ) => {
          setRecordedRoute(route)
          setGpsDurationSeconds(durationSeconds)
          setGpsDistanceMiles(distanceMiles)

          if (
            durationSeconds > 0 &&
            !lessonDuration.trim()
          ) {
            setLessonDuration(
              Math.max(
                1,
                Math.round(durationSeconds / 60),
              ).toString(),
            )
          }
        }}
      />

      {recordedRoute.length > 0 && (
        <div className="lesson-card spaced-card">
          <h3>Route ready</h3>
          <p>
            {recordedRoute.length} GPS points ·{' '}
            {gpsDistanceMiles.toFixed(2)} miles ·{' '}
            {formatGpsTime(gpsDurationSeconds)}
          </p>
        </div>
      )}

      <div className="lesson-card spaced-card">
        <h3>Date</h3>

        <input
          className="progress-select"
          type="date"
          value={lessonDate}
          onChange={(event) =>
            setLessonDate(event.target.value)
          }
        />
      </div>

      <div className="lesson-card spaced-card">
        <h3>Duration in minutes</h3>

        <input
          className="progress-select"
          type="number"
          min="1"
          value={lessonDuration}
          onChange={(event) =>
            setLessonDuration(event.target.value)
          }
        />
      </div>

      <div className="lesson-card spaced-card">
        <h3>Road type</h3>

        <select
          className="progress-select"
          value={roadType}
          onChange={(event) =>
            setRoadType(event.target.value)
          }
        >
          {roadTypes.map((option) => (
            <option key={option}>{option}</option>
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
            setObjectives(event.target.value)
          }
        />
      </div>

      <div className="lesson-card spaced-card">
        <h3>Skills practised</h3>

        {allSkills.map((skill) => (
          <label className="skill-checkbox" key={skill.id}>
            <input
              type="checkbox"
              checked={selectedLessonSkills.includes(skill.id)}
              onChange={() => toggleLessonSkill(skill.id)}
            />

            <span>
              {skill.id}. {skill.name}
            </span>
          </label>
        ))}
      </div>

      <div className="lesson-card spaced-card">
        <h3>What went well?</h3>

        <textarea
          className="progress-select"
          rows={4}
          value={wentWell}
          onChange={(event) =>
            setWentWell(event.target.value)
          }
        />
      </div>

      <div className="lesson-card spaced-card">
        <h3>What needs more work?</h3>

        <textarea
          className="progress-select"
          rows={4}
          value={needsWork}
          onChange={(event) =>
            setNeedsWork(event.target.value)
          }
        />
      </div>

      <div className="lesson-card spaced-card">
        <h3>Recommended next lesson</h3>

        <textarea
          className="progress-select"
          rows={3}
          value={nextLesson}
          onChange={(event) =>
            setNextLesson(event.target.value)
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
          <small>Add this session to lesson history</small>
        </span>

        <span>›</span>
      </button>
    </section>
  )

  const renderLessonEditor = (lesson: Lesson) => (
    <div className="lesson-card spaced-card">
      <h3>Edit lesson</h3>

      <p className="section-label">Date</p>
      <input
        className="progress-select"
        type="date"
        value={editDate}
        onChange={(event) => setEditDate(event.target.value)}
      />

      <p className="section-label editor-label">
        Duration
      </p>
      <input
        className="progress-select"
        type="number"
        value={editDuration}
        onChange={(event) =>
          setEditDuration(event.target.value)
        }
      />

      <p className="section-label editor-label">
        Road type
      </p>
      <select
        className="progress-select"
        value={editRoadType}
        onChange={(event) =>
          setEditRoadType(event.target.value)
        }
      >
        {roadTypes.map((option) => (
          <option key={option}>{option}</option>
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
          setEditObjectives(event.target.value)
        }
      />

      <p className="section-label editor-label">
        Skills
      </p>

      {allSkills.map((skill) => (
        <label className="skill-checkbox" key={skill.id}>
          <input
            type="checkbox"
            checked={editSkills.includes(skill.id)}
            onChange={() => toggleEditSkill(skill.id)}
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
          setEditWentWell(event.target.value)
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
          setEditNeedsWork(event.target.value)
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
          setEditNextLesson(event.target.value)
        }
      />

      <button
        className="start-button"
        type="button"
        onClick={saveEditedLesson}
      >
        <span>
          <strong>Save changes</strong>
          <small>Update this lesson</small>
        </span>

        <span>✓</span>
      </button>

      <button
        className="text-button full-text-button"
        type="button"
        onClick={() => setEditingLessonId(null)}
      >
        Cancel editing
      </button>

      <button
        className="text-button delete-text-button"
        type="button"
        onClick={() => deleteLesson(lesson)}
      >
        Delete lesson
      </button>
    </div>
  )

  const renderLessonSummary = () => {
    const lesson = lessons.find(
      (savedLesson) => savedLesson.id === selectedLessonId,
    )

    if (!lesson) {
      setSelectedLessonId(null)
      return null
    }

    if (editingLessonId === lesson.id) {
      return (
        <section>
          <button
            className="text-button"
            onClick={() => setEditingLessonId(null)}
          >
            ‹ Back to summary
          </button>

          {renderLessonEditor(lesson)}
        </section>
      )
    }

    return (
      <section>
        <button
          className="text-button"
          onClick={() => setSelectedLessonId(null)}
        >
          ‹ Back to lesson history
        </button>

        <p className="section-label">Lesson summary</p>
        <h1>{formatLessonDate(lesson.date)}</h1>

        <div className="lesson-summary-stats">
          <div>
            <strong>{lesson.duration}</strong>
            <span>minutes</span>
          </div>

          <div>
            <strong>{lesson.skills.length}</strong>
            <span>skills</span>
          </div>

          <div>
            <strong>
              {(lesson.gpsDistanceMiles ?? 0).toFixed(2)}
            </strong>
            <span>GPS miles</span>
          </div>
        </div>

        <div className="lesson-card spaced-card">
          <h3>Lesson details</h3>
          <p>
            <strong>Road type:</strong> {lesson.roadType}
          </p>

          {(lesson.route?.length ?? 0) > 0 && (
            <p>
              <strong>GPS recording:</strong>{' '}
              {formatGpsTime(
                lesson.gpsDurationSeconds ?? 0,
              )}{' '}
              · {lesson.route?.length ?? 0} points
            </p>
          )}
        </div>

        {(lesson.route?.length ?? 0) > 0 && (
          <div className="lesson-card spaced-card map-card">
            <h3>Lesson route</h3>

            <p>
              Internet connection required to load the map. The
              recorded route remains stored offline.
            </p>

            <RouteMap route={lesson.route ?? []} />
          </div>
        )}

        {lesson.objectives && (
          <div className="lesson-card spaced-card">
            <h3>Lesson objectives</h3>
            <p>{lesson.objectives}</p>
          </div>
        )}

        <div className="lesson-card spaced-card">
          <h3>Skills practised</h3>

          {lesson.skills.length > 0 ? (
            <div className="summary-skill-list">
              {lesson.skills.map((skillId) => (
                <span key={skillId}>
                  {skillId}. {getSkillName(skillId)}
                </span>
              ))}
            </div>
          ) : (
            <p>No skills were selected for this lesson.</p>
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
            <h3>What needs more work</h3>
            <p>{lesson.needsWork}</p>
          </div>
        )}

        {lesson.nextLesson && (
          <div className="lesson-card spaced-card">
            <h3>Recommended next lesson</h3>
            <p>{lesson.nextLesson}</p>
          </div>
        )}

        <div className="summary-actions">
          <button
            className="start-button"
            type="button"
            onClick={() => beginEditingLesson(lesson)}
          >
            <span>
              <strong>Edit lesson</strong>
              <small>Correct or update lesson details</small>
            </span>

            <span>›</span>
          </button>

          <button
            className="text-button delete-text-button"
            type="button"
            onClick={() => deleteLesson(lesson)}
          >
            Delete lesson
          </button>
        </div>
      </section>
    )
  }

  const renderProgress = () => {
    if (selectedLessonId !== null) {
      return renderLessonSummary()
    }

    return (
      <section>
        <p className="section-label">Learning overview</p>
        <h1>Progress</h1>

        <div className="lesson-card skills-summary">
          <h3>{overallProgress}% independently achieved</h3>

          <p>
            {completedSkills} of {allSkills.length} skills are
            Independent or Reflection.
          </p>
        </div>

        <div className="lesson-card spaced-card">
          <h3>Lessons recorded</h3>
          <p>{lessons.length} lessons are saved.</p>
        </div>

        {lessons.length > 0 && (
          <section className="section">
            <p className="section-label">Lesson history</p>
            <h2>Previous lessons</h2>

            {lessons.map((lesson) => (
              <button
                type="button"
                className="lesson-card lesson-history-button"
                key={lesson.id}
                onClick={() =>
                  navigateToLessonSummary(lesson.id)
                }
              >
                <span>
                  <strong>
                    {formatLessonDate(lesson.date)}
                  </strong>

                  <small>
                    {lesson.duration} minutes · {lesson.roadType}
                  </small>

                  <small>
                    {lesson.skills.length} skills
                    {(lesson.route?.length ?? 0) > 0
                      ? ` · ${(lesson.gpsDistanceMiles ?? 0).toFixed(
                          2,
                        )} GPS miles`
                      : ''}
                  </small>
                </span>

                <span className="skill-chevron">›</span>
              </button>
            ))}
          </section>
        )}
      </section>
    )
  }

  const renderMore = () => (
    <section>
      <p className="section-label">JackTrack</p>
      <h1>More</h1>

      <div className="lesson-card">
        <h3>Learner</h3>
        <p>Emily · Automatic car</p>
      </div>

      <div className="lesson-card spaced-card">
        <h3>Offline saving</h3>
        <p>
          Progress, lessons and GPS routes are stored on this device.
          Internet is only required to display route maps.
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
            <strong>Download backup</strong>
            <small>Save all learner data</small>
          </span>
          <span>↓</span>
        </button>

        <label className="start-button restore-label">
          <span>
            <strong>Restore backup</strong>
            <small>Choose a JackTrack backup</small>
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
          <p className="setting-message">{backupMessage}</p>
        )}
      </div>

      <div className="lesson-card spaced-card danger-card">
        <h3>Reset learner data</h3>

        <p>
          Permanently delete all progress, lessons and routes.
        </p>

        <button
          className="danger-button"
          type="button"
          onClick={resetLearnerData}
        >
          Reset Emily’s data
        </button>

        {resetMessage && (
          <p className="setting-message">{resetMessage}</p>
        )}
      </div>
    </section>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHome()
      case 'skills':
        return renderSkills()
      case 'lesson':
        return renderLesson()
      case 'progress':
        return renderProgress()
      case 'more':
        return renderMore()
    }
  }

  const changeTab = (tab: Tab) => {
    setActiveTab(tab)
    setSelectedSkill(null)

    if (tab !== 'progress') {
      setSelectedLessonId(null)
    }

    window.scrollTo({ top: 0 })
  }

  return (
    <main className="app">
      {renderContent()}

      <nav className="bottom-nav">
        {(
          [
            ['home', 'Home'],
            ['skills', 'Skills'],
            ['lesson', 'Lesson'],
            ['progress', 'Progress'],
            ['more', 'More'],
          ] as [Tab, string][]
        ).map(([tab, label]) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => changeTab(tab)}
          >
            {label}
          </button>
        ))}
      </nav>
    </main>
  )
}

export default App