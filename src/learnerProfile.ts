export type TransmissionType = 'Automatic' | 'Manual'

export type AvatarChoice =
  | 'initial'
  | 'car'
  | 'steering-wheel'
  | 'road'
  | 'traffic-light'
  | 'road-cone'
  | 'chequered-flag'
  | 'navigation-pin'
  | 'star'
  | 'lightning'

export type LearnerProfile = {
  name: string
  transmission: TransmissionType
  avatar: AvatarChoice
  createdAt: number
}

export const PROFILE_STORAGE_KEY =
  'jacktrack-learner-profile-v1'

export const LEGACY_DATA_STORAGE_KEY =
  'jacktrack-data-v1'

export const avatarChoices: {
  value: AvatarChoice
  label: string
}[] = [
  {
    value: 'initial',
    label: 'Initial',
  },
  {
    value: 'car',
    label: 'Car',
  },
  {
    value: 'steering-wheel',
    label: 'Steering wheel',
  },
  {
    value: 'road',
    label: 'Road',
  },
  {
    value: 'traffic-light',
    label: 'Traffic light',
  },
  {
    value: 'road-cone',
    label: 'Road cone',
  },
  {
    value: 'chequered-flag',
    label: 'Chequered flag',
  },
  {
    value: 'navigation-pin',
    label: 'Navigation pin',
  },
  {
    value: 'star',
    label: 'Star',
  },
  {
    value: 'lightning',
    label: 'Lightning',
  },
]

export const getInitial = (name: string) => {
  const trimmedName = name.trim()

  if (!trimmedName) return '?'

  return trimmedName.charAt(0).toUpperCase()
}

export const isValidAvatarChoice = (
  value: unknown,
): value is AvatarChoice =>
  avatarChoices.some(
    (choice) => choice.value === value,
  )

export const loadLearnerProfile =
  (): LearnerProfile | null => {
    try {
      const savedProfile = localStorage.getItem(
        PROFILE_STORAGE_KEY,
      )

      if (!savedProfile) return null

      const parsedProfile = JSON.parse(
        savedProfile,
      ) as Partial<LearnerProfile>

      if (
        typeof parsedProfile.name !== 'string' ||
        !parsedProfile.name.trim() ||
        (parsedProfile.transmission !== 'Automatic' &&
          parsedProfile.transmission !== 'Manual')
      ) {
        return null
      }

      return {
        name: parsedProfile.name.trim(),
        transmission: parsedProfile.transmission,
        avatar: isValidAvatarChoice(
          parsedProfile.avatar,
        )
          ? parsedProfile.avatar
          : 'initial',
        createdAt:
          typeof parsedProfile.createdAt === 'number'
            ? parsedProfile.createdAt
            : Date.now(),
      }
    } catch {
      return null
    }
  }

export const saveLearnerProfile = (
  profile: LearnerProfile,
) => {
  localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profile),
  )
}

export const hasExistingLearnerData = () => {
  try {
    const savedData = localStorage.getItem(
      LEGACY_DATA_STORAGE_KEY,
    )

    if (!savedData) return false

    const parsedData = JSON.parse(savedData) as {
      progress?: Record<string, string>
      lessons?: unknown[]
    }

    const hasLessons =
      Array.isArray(parsedData.lessons) &&
      parsedData.lessons.length > 0

    const hasProgress =
      parsedData.progress &&
      Object.values(parsedData.progress).some(
        (level) => level !== 'Not started',
      )

    return Boolean(hasLessons || hasProgress)
  } catch {
    return false
  }
}