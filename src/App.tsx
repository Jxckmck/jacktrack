import { useState } from 'react'
import './App.css'

type Tab = 'home' | 'skills' | 'lesson' | 'progress' | 'more'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  const renderContent = () => {
    if (activeTab === 'home') {
      return (
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

            <div className="progress-circle">
              <strong>11%</strong>
              <span>complete</span>
            </div>
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
        </>
      )
    }

    const pages = {
      skills: {
        title: 'Skills',
        description:
          'Track Emily’s progress through the DVSA learning syllabus.',
      },
      lesson: {
        title: 'Lesson',
        description:
          'Plan, start and review driving lessons from this section.',
      },
      progress: {
        title: 'Progress',
        description:
          'Review confidence, completed skills and areas needing more practice.',
      },
      more: {
        title: 'More',
        description:
          'Manage learner details, backups and JackTrack settings.',
      },
    }

    const page = pages[activeTab]

    return (
      <section className="page-placeholder">
        <p className="section-label">JackTrack</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>

        <div className="lesson-card">
          <h3>This page is ready to build next</h3>
          <p>
            The navigation is now working properly and this section will be
            developed in the next stage.
          </p>
        </div>
      </section>
    )
  }

  return (
    <main className="app">
      {renderContent()}

      <nav className="bottom-nav">
        <button
          className={activeTab === 'home' ? 'active' : ''}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>

        <button
          className={activeTab === 'skills' ? 'active' : ''}
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </button>

        <button
          className={activeTab === 'lesson' ? 'active' : ''}
          onClick={() => setActiveTab('lesson')}
        >
          Lesson
        </button>

        <button
          className={activeTab === 'progress' ? 'active' : ''}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </button>

        <button
          className={activeTab === 'more' ? 'active' : ''}
          onClick={() => setActiveTab('more')}
        >
          More
        </button>
      </nav>
    </main>
  )
}

export default App