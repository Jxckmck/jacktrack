import { useState } from 'react'
import './LearnerSetup.css'
import AvatarIcon from './AvatarIcon'
import { avatarChoices } from './learnerProfile'
import type {
  AvatarChoice,
  LearnerProfile,
  TransmissionType,
} from './learnerProfile'

type LearnerSetupProps = {
  onComplete: (profile: LearnerProfile) => void
}

function LearnerSetup({
  onComplete,
}: LearnerSetupProps) {
  const [name, setName] = useState('')
  const [transmission, setTransmission] =
    useState<TransmissionType>('Automatic')
  const [avatar, setAvatar] =
    useState<AvatarChoice>('initial')
  const [errorMessage, setErrorMessage] = useState('')

  const cleanedName = name.trim()

  const finishSetup = () => {
    if (!cleanedName) {
      setErrorMessage(
        'Please enter the learner’s first name.',
      )
      return
    }

    onComplete({
      name: cleanedName,
      transmission,
      avatar,
      createdAt: Date.now(),
    })
  }

  return (
    <main className="setup-screen">
      <section className="setup-panel">
        <div className="setup-logo">JT</div>

        <p className="section-label">
          Welcome to JackTrack
        </p>

        <h1>Set up the learner</h1>

        <p className="setup-introduction">
          Create a learner profile. These details stay on this
          device and can be changed later.
        </p>

        <div className="setup-field">
          <label htmlFor="learner-name">
            Learner’s first name
          </label>

          <input
            id="learner-name"
            className="progress-select"
            type="text"
            value={name}
            maxLength={40}
            autoComplete="given-name"
            placeholder="For example, Emily"
            onChange={(event) => {
              setName(event.target.value)
              setErrorMessage('')
            }}
          />
        </div>

        <fieldset className="setup-field setup-options">
          <legend>
            Which car are they learning in?
          </legend>

          <label
            className={
              transmission === 'Automatic'
                ? 'setup-option selected'
                : 'setup-option'
            }
          >
            <input
              type="radio"
              name="transmission"
              value="Automatic"
              checked={transmission === 'Automatic'}
              onChange={() =>
                setTransmission('Automatic')
              }
            />

            <span>
              <strong>Automatic</strong>

              <small>
                No clutch pedal or manual gear changes
              </small>
            </span>
          </label>

          <label
            className={
              transmission === 'Manual'
                ? 'setup-option selected'
                : 'setup-option'
            }
          >
            <input
              type="radio"
              name="transmission"
              value="Manual"
              checked={transmission === 'Manual'}
              onChange={() =>
                setTransmission('Manual')
              }
            />

            <span>
              <strong>Manual</strong>

              <small>
                Includes clutch control and gear changes
              </small>
            </span>
          </label>
        </fieldset>

        <fieldset className="setup-field avatar-options">
          <legend>
            Choose an avatar{' '}
            <span className="optional-label">
              Optional
            </span>
          </legend>

          <div className="avatar-choice-grid">
            {avatarChoices.map((choice) => (
              <label
                className={
                  avatar === choice.value
                    ? 'avatar-choice selected'
                    : 'avatar-choice'
                }
                key={choice.value}
              >
                <input
                  type="radio"
                  name="avatar"
                  value={choice.value}
                  checked={avatar === choice.value}
                  onChange={() =>
                    setAvatar(choice.value)
                  }
                />

                <span className="avatar-choice-symbol">
                  <AvatarIcon
                    avatar={choice.value}
                    name={cleanedName}
                    className="avatar-svg"
                  />
                </span>

                <span className="avatar-choice-label">
                  {choice.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {errorMessage && (
          <p className="setup-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          className="start-button"
          type="button"
          onClick={finishSetup}
        >
          <span>
            <strong>Start using JackTrack</strong>
            <small>Create the learner profile</small>
          </span>

          <span>›</span>
        </button>

        <p className="setup-privacy">
          Progress, lessons and GPS routes are stored locally
          on this device.
        </p>
      </section>
    </main>
  )
}

export default LearnerSetup