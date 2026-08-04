import './SkillGuidancePanel.css'
import type { LearnerProfile } from './learnerProfile'
import { skillGuidance } from './skillGuidance'

type SkillGuidancePanelProps = {
  skillId: number
  learner: LearnerProfile
}

function GuidanceList({
  items,
}: {
  items: string[]
}) {
  return (
    <ul className="guidance-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function SkillGuidancePanel({
  skillId,
  learner,
}: SkillGuidancePanelProps) {
  const guidance = skillGuidance[skillId]

  if (!guidance) {
    return (
      <div className="lesson-card spaced-card">
        <h3>Detailed guidance coming soon</h3>

        <p>
          This skill will be expanded with practical
          teaching points, lesson ideas and clear progress
          criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="skill-guidance">
      <div className="lesson-card spaced-card guidance-summary">
        <p className="section-label">
          What this skill means
        </p>

        <p>{guidance.summary}</p>
      </div>

      <div className="lesson-card spaced-card">
        <h3>What to cover</h3>

        <GuidanceList items={guidance.covering} />
      </div>

      <div className="lesson-card spaced-card">
        <h3>Practice session ideas</h3>

        <GuidanceList items={guidance.practiceIdeas} />
      </div>

      <div className="lesson-card spaced-card">
        <h3>Questions for {learner.name}</h3>

        <GuidanceList
          items={guidance.learnerQuestions}
        />
      </div>

      {learner.transmission === 'Automatic' &&
        guidance.automaticTip && (
          <div className="lesson-card spaced-card automatic-guidance-card">
            <h3>Automatic-car guidance</h3>

            <p>{guidance.automaticTip}</p>
          </div>
        )}

      <div className="lesson-card spaced-card">
        <h3>Supervisor watch-outs</h3>

        <GuidanceList items={guidance.watchOuts} />
      </div>

      <div className="lesson-card spaced-card ready-guidance-card">
        <h3>Ready to progress when</h3>

        <GuidanceList items={guidance.readyWhen} />
      </div>
    </div>
  )
}

export default SkillGuidancePanel