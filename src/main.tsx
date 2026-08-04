import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import LearnerSetup from './LearnerSetup'
import {
  hasExistingLearnerData,
  loadLearnerProfile,
  saveLearnerProfile,
} from './learnerProfile'
import type { LearnerProfile } from './learnerProfile'

function JackTrackRoot() {
  const [profile, setProfile] =
    useState<LearnerProfile | null>(() => {
      const savedProfile = loadLearnerProfile()

      if (savedProfile) {
        return savedProfile
      }

      /*
       * Older JackTrack installations were originally made
       * specifically for Emily. Existing lesson or progress data
       * is therefore migrated to an Emily profile automatically.
       */
      if (hasExistingLearnerData()) {
        const migratedProfile: LearnerProfile = {
          name: 'Emily',
          transmission: 'Automatic',
          avatar: 'initial',
          createdAt: Date.now(),
        }

        saveLearnerProfile(migratedProfile)

        return migratedProfile
      }

      return null
    })

  const completeSetup = (
    newProfile: LearnerProfile,
  ) => {
    saveLearnerProfile(newProfile)
    setProfile(newProfile)
  }

  const updateProfile = (
    updatedProfile: LearnerProfile,
  ) => {
    saveLearnerProfile(updatedProfile)
    setProfile(updatedProfile)
  }

  if (!profile) {
    return (
      <LearnerSetup onComplete={completeSetup} />
    )
  }

  return (
    <App
      profile={profile}
      onProfileChange={updateProfile}
    />
  )
}

createRoot(
  document.getElementById('root')!,
).render(
  <StrictMode>
    <JackTrackRoot />
  </StrictMode>,
)