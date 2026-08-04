import { ChangeEvent, useEffect, useState } from 'react'
import './App.css'

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
    <div className="jt-progress-ring" aria-label={`${percentage}% complete`}>
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
        <strong style={{ color: progressColour }}>{percentage}%</strong>
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

  const [progress, setProgress] =
    useState<Record<number, ProgressLevel>>(initialData.progress)

  const [lessons, setLessons] = useState<Lesson[]>(initialData.lessons)

  const [lessonDate, setLessonDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [lessonDuration, setLessonDuration] = useState('')
  const [roadType, setRoadType] = useState('Quiet residential roads')
  const [objectives, setObjectives] = useState('')
  const [selectedLessonSkills, setSelectedLessonSkills] =
    useState<number[]>([])
  const [wentWell, setWentWell] = useState('')
  const [needsWork, setNeedsWork] = useState('')
  const [nextLesson, setNextLesson] = useState('')
  const [lessonSaved, setLessonSaved] = useState(false)
  const [backupMessage, setBackupMessage] = useState('')

  useEffect(() => {
    const dataToSave: SavedData = {
      progress,
      lessons,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [progress, lessons])

  const updateProgress = (
    skillId: number,
    level: ProgressLevel,
  ) => {
    setProgress((currentProgress) => ({
      ...currentProgress,
      [skillId]: level,
    }))
  }

  const completedSkills = Object.values(progress).filter(
    (level) =>
      level === 'Independent' || level === 'Reflection',
  ).length

  const overallProgress = Math.round((completedSkills / 27) * 100)

  const toggleLessonSkill = (skillId: number) => {
    setSelectedLessonSkills((currentSkills) =>
      currentSkills.includes(skillId)
        ? currentSkills.filter((id) => id !== skillId)
        : [...currentSkills, skillId],
    )
  }

  const saveLesson = () => {
    if (!lessonDuration.trim()) {
      alert('Please enter the lesson duration.')
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
  }

  const exportBackup = () => {
    const backupData: SavedData = {
      progress,
      lessons,
    }

    const fileContents = JSON.stringify(backupData, null, 2)
    const fileBlob = new Blob([fileContents], {
      type: 'application/json',
    })

    const downloadUrl = URL.createObjectURL(fileBlob)
    const downloadLink = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)

    downloadLink.href = downloadUrl
    downloadLink.download = `jacktrack-emily-backup-${date}.json`
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
      const fileContents = await backupFile.text()
      const parsedData = JSON.parse(fileContents) as Partial<SavedData>

      if (
        !parsedData ||
        typeof parsedData !== 'object' ||
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
      setBackupMessage('Backup restored successfully.')
    } catch {
      setBackupMessage(
        'That file is not a valid JackTrack backup.',
      )
    }

    event.target.value = ''
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
            Practise observations, smooth brake release and controlled
            stopping.
          </p>
          <span>30–40 minutes</span>
        </div>
      </section>

      {lessons.length > 0 && (
        <section className="section">
          <p className="section-label">Latest lesson</p>
          <h2>{formatLessonDate(lessons[0].date)}</h2>

          <div className="lesson-card">
            <h3>
              {lessons[0].duration} minutes · {lessons[0].roadType}
            </h3>

            <p>
              {lessons[0].wentWell ||
                'Lesson saved. Add reflection notes next time for a fuller summary.'}
            </p>

            <span>{lessons[0].skills.length} skills practised</span>
          </div>
        </section>
      )}
    </>
  )

  const renderSkillDetail = () => {
    if (!selectedSkill) return null

    return (
      <section className="page-placeholder">
        <button
          className="text-button"
          onClick={() => setSelectedSkill(null)}
        >
          ‹ Back to skills
        </button>

        <p className="section-label">
          Skill {selectedSkill.id} of 27
        </p>

        <h1>{selectedSkill.name}</h1>

        <div className="lesson-card">
          <h3>Current progress</h3>
          <p>
            Choose the level that best reflects Emily’s current
            ability.
          </p>

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
              <option key={level} value={level}>
                {level}
              </option>
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
      <section className="page-placeholder">
        <p className="section-label">Official DVSA record</p>
        <h1>Driving skills</h1>

        <p>
          Track Emily’s development through all 27 recommended
          learning skills.
        </p>

        <div className="lesson-card skills-summary">
          <h3>{completedSkills} of 27 independently achieved</h3>
          <p>
            Skills count towards completion when they reach
            Independent or Reflection.
          </p>
        </div>

        {skillGroups.map((group) => (
          <section className="skill-group" key={group.name}>
            <p className="section-label">{group.name}</p>

            {group.skills.map((skill) => (
              <button
                key={skill.id}
                className="lesson-card skill-button"
                onClick={() => setSelectedSkill(skill)}
              >
                <span>
                  <strong>
                    {skill.id}. {skill.name}
                  </strong>
                  <small>{progress[skill.id]}</small>
                </span>

                <span className="skill-chevron">›</span>
              </button>
            ))}
          </section>
        ))}
      </section>
    )
  }

  const renderLesson = () => (
    <section className="page-placeholder">
      <p className="section-label">Private practice</p>
      <h1>Record a lesson</h1>

      <p>
        Set this up before driving, then complete the reflection once
        safely parked.
      </p>

      {lessonSaved && (
        <div className="lesson-card skills-summary">
          <h3>Lesson saved</h3>
          <p>Your lesson has been saved permanently on this device.</p>
        </div>
      )}

      <div className="lesson-card">
        <h3>Date</h3>
        <input
          className="progress-select"
          type="date"
          value={lessonDate}
          onChange={(event) => setLessonDate(event.target.value)}
        />
      </div>

      <div className="lesson-card spaced-card">
        <h3>Duration in minutes</h3>
        <input
          className="progress-select"
          type="number"
          min="1"
          placeholder="Example: 45"
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
          onChange={(event) => setRoadType(event.target.value)}
        >
          <option>Quiet residential roads</option>
          <option>Industrial estate</option>
          <option>Town centre</option>
          <option>Rural roads</option>
          <option>Dual carriageway</option>
          <option>Mixed roads</option>
          <option>Car park or private land</option>
        </select>
      </div>

      <div className="lesson-card spaced-card">
        <h3>Lesson objectives</h3>
        <textarea
          className="progress-select"
          rows={4}
          placeholder="What are you planning to practise?"
          value={objectives}
          onChange={(event) => setObjectives(event.target.value)}
        />
      </div>

      <div className="lesson-card spaced-card">
        <h3>Skills practised</h3>
        <p>Select all skills covered during the lesson.</p>

        {allSkills.map((skill) => (
          <label
            key={skill.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 0',
              borderBottom: '1px solid #eef0f3',
              fontSize: '14px',
            }}
          >
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
          placeholder="Record strengths and improvements."
          value={wentWell}
          onChange={(event) => setWentWell(event.target.value)}
        />
      </div>

      <div className="lesson-card spaced-card">
        <h3>What needs more work?</h3>
        <textarea
          className="progress-select"
          rows={4}
          placeholder="Record mistakes, prompts or areas lacking confidence."
          value={needsWork}
          onChange={(event) => setNeedsWork(event.target.value)}
        />
      </div>

      <div className="lesson-card spaced-card">
        <h3>Recommended next lesson</h3>
        <textarea
          className="progress-select"
          rows={3}
          placeholder="What should you focus on next time?"
          value={nextLesson}
          onChange={(event) => setNextLesson(event.target.value)}
        />
      </div>

      <button
        className="start-button"
        type="button"
        onClick={saveLesson}
      >
        <span>
          <strong>Save lesson</strong>
          <small>Add this session to Emily’s lesson history</small>
        </span>
        <span>›</span>
      </button>
    </section>
  )

  const renderProgress = () => (
    <section className="page-placeholder">
      <p className="section-label">Learning overview</p>
      <h1>Progress</h1>

      <div className="lesson-card skills-summary">
        <h3>{overallProgress}% independently achieved</h3>
        <p>
          {completedSkills} of 27 skills are currently marked
          Independent or Reflection.
        </p>
      </div>

      <div className="lesson-card spaced-card">
        <h3>Lessons recorded</h3>
        <p>{lessons.length} lessons are saved on this device.</p>
      </div>

      {lessons.length > 0 && (
        <section className="section">
          <p className="section-label">Lesson history</p>
          <h2>Previous lessons</h2>

          {lessons.map((lesson) => (
            <div
              className="lesson-card spaced-card"
              key={lesson.id}
            >
              <h3>{formatLessonDate(lesson.date)}</h3>

              <p>
                {lesson.duration} minutes · {lesson.roadType}
              </p>

              {lesson.objectives && (
                <p>
                  <strong>Objectives:</strong> {lesson.objectives}
                </p>
              )}

              {lesson.wentWell && (
                <p>
                  <strong>Went well:</strong> {lesson.wentWell}
                </p>
              )}

              {lesson.needsWork && (
                <p>
                  <strong>Needs work:</strong> {lesson.needsWork}
                </p>
              )}

              {lesson.nextLesson && (
                <p>
                  <strong>Next lesson:</strong> {lesson.nextLesson}
                </p>
              )}

              <p>{lesson.skills.length} skills practised</p>

              <button
                type="button"
                className="text-button"
                style={{
                  marginBottom: 0,
                  color: '#dc2626',
                }}
                onClick={() => deleteLesson(lesson)}
              >
                Delete lesson
              </button>
            </div>
          ))}
        </section>
      )}
    </section>
  )

  const renderMore = () => (
    <section className="page-placeholder">
      <p className="section-label">JackTrack</p>
      <h1>More</h1>

      <div className="lesson-card">
        <h3>Learner</h3>
        <p>Emily · Automatic car</p>
      </div>

      <div className="lesson-card spaced-card">
        <h3>Offline saving</h3>
        <p>
          Skill progress and lesson history are automatically saved
          on this device.
        </p>
      </div>

      <div className="lesson-card spaced-card">
        <h3>Backup and restore</h3>
        <p>
          Download a backup before changing devices or clearing browser
          data.
        </p>

        <button
          className="start-button"
          type="button"
          onClick={exportBackup}
        >
          <span>
            <strong>Download backup</strong>
            <small>Save Emily’s current JackTrack data</small>
          </span>
          <span>↓</span>
        </button>

        <label
          className="start-button"
          style={{
            marginTop: '12px',
            cursor: 'pointer',
          }}
        >
          <span>
            <strong>Restore backup</strong>
            <small>Choose a previous JackTrack backup file</small>
          </span>

          <span>↑</span>

          <input
            type="file"
            accept=".json,application/json"
            onChange={restoreBackup}
            style={{ display: 'none' }}
          />
        </label>

        {backupMessage && (
          <p
            style={{
              marginTop: '14px',
              marginBottom: 0,
              fontWeight: 700,
            }}
          >
            {backupMessage}
          </p>
        )}
      </div>

      <div className="lesson-card spaced-card">
        <h3>Coming next</h3>
        <p>
          Editing lessons, quick skill updating, learner reset and GPS
          route recording.
        </p>
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

  return (
    <main className="app">
      {renderContent()}

      <nav className="bottom-nav">
        <button
          className={activeTab === 'home' ? 'active' : ''}
          onClick={() => {
            setActiveTab('home')
            setSelectedSkill(null)
          }}
        >
          Home
        </button>

        <button
          className={activeTab === 'skills' ? 'active' : ''}
          onClick={() => {
            setActiveTab('skills')
            setSelectedSkill(null)
          }}
        >
          Skills
        </button>

        <button
          className={activeTab === 'lesson' ? 'active' : ''}
          onClick={() => {
            setActiveTab('lesson')
            setSelectedSkill(null)
          }}
        >
          Lesson
        </button>

        <button
          className={activeTab === 'progress' ? 'active' : ''}
          onClick={() => {
            setActiveTab('progress')
            setSelectedSkill(null)
          }}
        >
          Progress
        </button>

        <button
          className={activeTab === 'more' ? 'active' : ''}
          onClick={() => {
            setActiveTab('more')
            setSelectedSkill(null)
          }}
        >
          More
        </button>
      </nav>
    </main>
  )
}

export default App