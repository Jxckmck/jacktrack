import { useState } from 'react'
import './StructuredLessonPlan.css'
import { skillGuidance } from './skillGuidance'
import type { LearnerProfile } from './learnerProfile'

type StructuredLessonPlanProps = {
  skillId: number
  skillName: string
  learner: LearnerProfile
}

type LessonStage = {
  id: string
  title: string
  suggestedTime: string
  description: string
  activities: string[]
}

function StructuredLessonPlan({
  skillId,
  skillName,
  learner,
}: StructuredLessonPlanProps) {
  const guidance = skillGuidance[skillId]

  const [isOpen, setIsOpen] = useState(false)

  const [completedStages, setCompletedStages] = useState<
    string[]
  >([])

  if (!guidance) return null

  const coveringPoints = guidance.covering.slice(0, 4)

  const supportedPractice =
    guidance.practiceIdeas.slice(0, 2)

  const independentPractice =
    guidance.practiceIdeas.slice(2, 4)

  const reflectionQuestions =
    guidance.learnerQuestions.slice(0, 4)

  const lessonStages: LessonStage[] = [
    {
      id: 'briefing',
      title: '1. Briefing',
      suggestedTime: '5 minutes',
      description:
        `Explain what ${skillName.toLowerCase()} means and agree what ${learner.name} will focus on during the session.`,
      activities: [
        guidance.summary,
        ...coveringPoints,
      ],
    },
    {
      id: 'demonstration',
      title: '2. Demonstration and explanation',
      suggestedTime: '5–10 minutes',
      description:
        'Explain or demonstrate the skill before expecting independent performance.',
      activities: [
        `Talk through the correct routine for ${skillName.toLowerCase()}.`,
        'Explain what information the driver should look for.',
        'Show how speed, position and observation affect the result.',
        'Point out one or two common mistakes before practice begins.',
      ],
    },
    {
      id: 'supported',
      title: '3. Supported practice',
      suggestedTime: '10–15 minutes',
      description:
        `Allow ${learner.name} to practise with clear instructions, questions and support.`,
      activities:
        supportedPractice.length > 0
          ? supportedPractice
          : [
              'Practise the skill in a quiet and predictable environment.',
              'Use short prompts only when they are genuinely needed.',
            ],
    },
    {
      id: 'independent',
      title: '4. Independent practice',
      suggestedTime: '10–20 minutes',
      description:
        `Reduce prompting and allow ${learner.name} to make their own decisions.`,
      activities: [
        ...(independentPractice.length > 0
          ? independentPractice
          : [
              'Repeat the skill in a slightly more varied situation.',
            ]),
        'Avoid giving instructions too early.',
        'Allow time for the learner to identify hazards and correct minor errors.',
        'Intervene immediately if safety or control is at risk.',
      ],
    },
    {
      id: 'reflection',
      title: '5. Reflection and next step',
      suggestedTime: '5 minutes',
      description:
        'Finish while safely parked. Review the session and agree what should happen next.',
      activities: [
        ...reflectionQuestions,
        `Ask ${learner.name} what they would repeat or change next time.`,
        'Agree whether the skill needs more supported practice or is ready for less prompting.',
      ],
    },
  ]

  const completedCount = completedStages.length

  const toggleStage = (stageId: string) => {
    setCompletedStages((currentStages) =>
      currentStages.includes(stageId)
        ? currentStages.filter(
            (currentId) => currentId !== stageId,
          )
        : [...currentStages, stageId],
    )
  }

  return (
    <section className="structured-plan">
      <button
        type="button"
        className={
          isOpen
            ? 'lesson-plan-toggle open'
            : 'lesson-plan-toggle'
        }
        onClick={() =>
          setIsOpen((currentValue) => !currentValue)
        }
        aria-expanded={isOpen}
      >
        <span>
          <strong>Guided lesson plan</strong>

          <small>
            Five stages · approximately 35–55 minutes
          </small>
        </span>

        <span className="lesson-plan-chevron">
          {isOpen ? '⌃' : '⌄'}
        </span>
      </button>

      {isOpen && (
        <div className="lesson-plan-content">
          <div className="lesson-plan-progress">
            <div>
              <strong>
                {completedCount} of {lessonStages.length}
              </strong>

              <span>stages completed</span>
            </div>

            <div
              className="lesson-plan-progress-track"
              aria-hidden="true"
            >
              <span
                style={{
                  width: `${
                    (completedCount /
                      lessonStages.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {lessonStages.map((stage) => {
            const isCompleted =
              completedStages.includes(stage.id)

            return (
              <article
                className={
                  isCompleted
                    ? 'lesson-plan-stage completed'
                    : 'lesson-plan-stage'
                }
                key={stage.id}
              >
                <div className="lesson-plan-stage-heading">
                  <div>
                    <h3>{stage.title}</h3>

                    <span>{stage.suggestedTime}</span>
                  </div>

                  <button
                    type="button"
                    className="stage-complete-button"
                    onClick={() =>
                      toggleStage(stage.id)
                    }
                    aria-pressed={isCompleted}
                  >
                    {isCompleted ? '✓ Done' : 'Mark done'}
                  </button>
                </div>

                <p>{stage.description}</p>

                <ul className="guidance-list">
                  {stage.activities.map(
                    (activity, index) => (
                      <li
                        key={`${stage.id}-${index}`}
                      >
                        {activity}
                      </li>
                    ),
                  )}
                </ul>
              </article>
            )
          })}

          <p className="lesson-plan-note">
            Suggested timings are flexible. Stop or simplify
            the session whenever concentration, safety or
            confidence begins to drop.
          </p>
        </div>
      )}
    </section>
  )
}

export default StructuredLessonPlan