import { useEffect, useState } from 'react'
import './StructuredLessonPlan.css'
import { instructorGuidance } from './instructorGuidance'
import { skillGuidance } from './skillGuidance'
import type { LearnerProfile } from './learnerProfile'


type StructuredLessonPlanProps = {
  skillId: number
  skillName: string
  learner: LearnerProfile
  lessonStarted: boolean
}


type LessonSection = {
  title: string
  items: string[]
  variant?:
    | 'standard'
    | 'script'
    | 'warning'
    | 'ready'
    | 'automatic'
}


type LessonStage = {
  id: string
  title: string
  suggestedTime: string
  description: string
  sections: LessonSection[]
}


function StructuredLessonPlan({
  skillId,
  skillName,
  learner,
  lessonStarted,
}: StructuredLessonPlanProps) {
  const guidance = skillGuidance[skillId]
  const instructor = instructorGuidance[skillId]


  const [isOpen, setIsOpen] = useState(false)


  const [completedStages, setCompletedStages] = useState<
    string[]
  >([])


  useEffect(() => {
    setCompletedStages([])
  }, [skillId])


  if (!guidance) return null


  const teachingOrder =
    instructor?.teachingOrder ?? guidance.covering


  const suggestedWording =
    instructor?.suggestedWording ?? [
      `Explain what ${skillName.toLowerCase()} means before asking ${learner.name} to practise it.`,
    ]


  const demonstration =
    instructor?.demonstration ?? [
      `Demonstrate the correct approach to ${skillName.toLowerCase()} in a suitable situation.`,
      'Talk through what you are looking for, the decision you are making and why.',
    ]


  const fullPrompt =
    instructor?.promptLadder.full ??
    'Give clear step-by-step support while the learner is building the skill.'


  const shortPrompt =
    instructor?.promptLadder.short ??
    'Reduce support to a short reminder or question.'


  const independentPrompt =
    instructor?.promptLadder.independent ??
    'Give the route or task only and allow the learner to make the decisions.'


  const mistakeResponses =
    instructor?.mistakeResponses.map(
      ({ issue, coachingResponse }) =>
        `${issue} — ${coachingResponse}`,
    ) ?? guidance.watchOuts


  const interveneIf =
    instructor?.interveneIf ?? guidance.watchOuts


  const supportedPractice =
    guidance.practiceIdeas.slice(0, 2)


  const independentPractice =
    guidance.practiceIdeas.slice(2)


  const lessonStages: LessonStage[] = [
    {
      id: 'briefing',
      title: '1. Briefing',
      suggestedTime: '5–10 minutes',
      description:
        `Before moving, make sure ${learner.name} understands what the skill is, why it matters and what you will practise today.`,
      sections: [
        {
          title: 'Teach it in this order',
          items: teachingOrder,
        },
        {
          title: 'Try saying',
          items: suggestedWording,
          variant: 'script',
        },
        {
          title: 'Key points to cover',
          items: guidance.covering,
        },
      ],
    },
    {
      id: 'demonstration',
      title: '2. Demonstration and explanation',
      suggestedTime: '5–10 minutes',
      description:
        'Show the skill before expecting independent performance. Explain what you are seeing, deciding and doing rather than simply showing the finished result.',
      sections: [
        {
          title: 'What to demonstrate',
          items: demonstration,
        },
        ...(learner.transmission === 'Automatic' &&
        guidance.automaticTip
          ? [
              {
                title: 'Automatic-car coaching',
                items: [guidance.automaticTip],
                variant: 'automatic' as const,
              },
            ]
          : []),
      ],
    },
    {
      id: 'supported',
      title: '3. Supported practice',
      suggestedTime: '10–20 minutes',
      description:
        `Let ${learner.name} perform the skill while you give enough support to keep the task manageable. Reduce your help as soon as it is no longer needed.`,
      sections: [
        {
          title: 'Practice first',
          items:
            supportedPractice.length > 0
              ? supportedPractice
              : [
                  'Practise in a quiet and predictable environment before increasing difficulty.',
                ],
        },
        {
          title: 'Prompt ladder',
          items: [
            `Full support: ${fullPrompt}`,
            `Then shorten it: ${shortPrompt}`,
          ],
          variant: 'script',
        },
        {
          title: 'Common mistakes and how to coach them',
          items: mistakeResponses,
          variant: 'warning',
        },
      ],
    },
    {
      id: 'independent',
      title: '4. Independent practice',
      suggestedTime: '10–20 minutes',
      description:
        `Step back and allow ${learner.name} to make the observations, decisions and corrections. Avoid helping simply because there is a pause.`,
      sections: [
        {
          title: 'Build independence',
          items:
            independentPractice.length > 0
              ? independentPractice
              : [
                  'Repeat the skill in a slightly more varied situation.',
                ],
        },
        {
          title: 'Your instruction now',
          items: [independentPrompt],
          variant: 'script',
        },
        {
          title: 'Supervisor watch-outs',
          items: guidance.watchOuts,
          variant: 'warning',
        },
        {
          title: 'Intervene immediately if',
          items: interveneIf,
          variant: 'warning',
        },
      ],
    },
    {
      id: 'reflection',
      title: '5. Reflection and next step',
      suggestedTime: '5–10 minutes',
      description:
        'Finish while safely parked. Let the learner do most of the talking, then agree the level of support needed next time.',
      sections: [
        {
          title: `Questions for ${learner.name}`,
          items: guidance.learnerQuestions,
          variant: 'script',
        },
        {
          title: 'Ready to progress when',
          items: guidance.readyWhen,
          variant: 'ready',
        },
        {
          title: 'Decide the next step',
          items: [
            'If the learner still needs full instructions, repeat the skill in an easier or more predictable setting.',
            'If short prompts are enough, keep practising while gradually removing them.',
            'If the learner manages the skill independently and safely, introduce more varied situations rather than immediately marking the skill as finished.',
          ],
        },
      ],
    },
  ]


  const completedCount = completedStages.length


  const toggleStage = (stageId: string) => {
    if (!lessonStarted) {
      window.alert(
        'You need to start the lesson first. Starting the lesson also starts GPS recording.',
      )
      return
    }

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
          <strong>Instructor mode</strong>


          <small>
            Step-by-step teaching · approximately 35–70 minutes
          </small>
        </span>


        <span className="lesson-plan-chevron">
          {isOpen ? '⌃' : '⌄'}
        </span>
      </button>


      {isOpen && (
        <div className="lesson-plan-content">
          <div className="lesson-plan-intro">
            <strong>
              Teaching {skillName.toLowerCase()}
            </strong>


            <p>
              Work through the stages in order, but adapt the
              amount of help to {learner.name}. You do not need
              to complete every activity in one drive.
            </p>

            {!lessonStarted && (
              <p>
                Start the lesson first to unlock stage completion.
                This makes sure the lesson timer and GPS are running
                before any teaching stages are marked as done.
              </p>
            )}
          </div>


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
                    aria-disabled={!lessonStarted}
                  >
                    {!lessonStarted
                      ? 'Start lesson first'
                      : isCompleted
                        ? '✓ Done'
                        : 'Mark done'}
                  </button>
                </div>


                <p>{stage.description}</p>


                {stage.sections.map((section) => (
                  <div
                    className={`lesson-plan-subsection ${
                      section.variant
                        ? `lesson-plan-subsection-${section.variant}`
                        : ''
                    }`}
                    key={`${stage.id}-${section.title}`}
                  >
                    <h4>{section.title}</h4>


                    <ul className="guidance-list">
                      {section.items.map(
                        (item, index) => (
                          <li
                            key={`${stage.id}-${section.title}-${index}`}
                          >
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ))}
              </article>
            )
          })}


          <p className="lesson-plan-note">
            Suggested timings are flexible. Start and finish
            lesson setup only while safely parked. While the
            vehicle is moving, concentrate on supervising the
            learner and the road rather than interacting with
            JackTrack.
          </p>
        </div>
      )}
    </section>
  )
}


export default StructuredLessonPlan
