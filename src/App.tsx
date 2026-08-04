import './App.css'

function App() {
  return (
    <main className="app">
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
          <p>
            Keep each session calm, focused and consistent.
          </p>
        </div>

        <div className="progress-circle">
          <strong>11%</strong>
          <span>complete</span>
        </div>
      </section>

      <button className="start-button">
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
            Practise observations, smooth brake release and controlled stopping.
          </p>
          <span>30–40 minutes</span>
        </div>
      </section>

      <nav className="bottom-nav">
        <button className="active">Home</button>
        <button>Skills</button>
        <button>Lesson</button>
        <button>Progress</button>
        <button>More</button>
      </nav>
    </main>
  )
}

export default App