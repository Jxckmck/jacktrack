import type { CSSProperties } from 'react'
import type { AvatarChoice } from './learnerProfile'
import { getInitial } from './learnerProfile'

type AvatarIconProps = {
  avatar: AvatarChoice
  name: string
  className?: string
}

const iconStyle: CSSProperties = {
  width: '28px',
  height: '28px',
  display: 'block',
  color: '#ffffff',
  flexShrink: 0,
}

const initialStyle: CSSProperties = {
  ...iconStyle,
  display: 'grid',
  placeItems: 'center',
  fontSize: '18px',
  fontWeight: 900,
  lineHeight: 1,
}

function AvatarIcon({
  avatar,
  name,
  className = '',
}: AvatarIconProps) {
  const sharedProps = {
    viewBox: '0 0 64 64',
    role: 'img',
    'aria-hidden': true,
    className,
    style: iconStyle,
  }

  if (avatar === 'initial') {
    return (
      <span
        className={className}
        style={initialStyle}
        aria-hidden="true"
      >
        {getInitial(name)}
      </span>
    )
  }

  if (avatar === 'car') {
    return (
      <svg {...sharedProps}>
        <path
          d="M17 26 23 15h18l6 11"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <path
          d="M12 28c0-3 2-5 5-5h30c3 0 5 2 5 5v15H12V28Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <path
          d="M18 43v5M46 43v5"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <circle cx="21" cy="34" r="3" fill="#ffffff" />
        <circle cx="43" cy="34" r="3" fill="#ffffff" />
      </svg>
    )
  }

  if (avatar === 'steering-wheel') {
    return (
      <svg {...sharedProps}>
        <circle
          cx="32"
          cy="32"
          r="22"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
        />

        <circle
          cx="32"
          cy="32"
          r="7"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
        />

        <path
          d="M11 30h14M39 30h14M32 39v14"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <path
          d="M20 17c4 4 8 6 12 6s8-2 12-6"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (avatar === 'road') {
    return (
      <svg {...sharedProps}>
        <path
          d="M22 8h20l11 48H11L22 8Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <path
          d="M32 12v8M32 28v8M32 44v8"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (avatar === 'traffic-light') {
    return (
      <svg {...sharedProps}>
        <rect
          x="19"
          y="7"
          width="26"
          height="42"
          rx="7"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
        />

        <circle cx="32" cy="17" r="4" fill="#ffffff" />
        <circle
          cx="32"
          cy="28"
          r="4"
          fill="#ffffff"
          opacity="0.7"
        />
        <circle
          cx="32"
          cy="39"
          r="4"
          fill="#ffffff"
          opacity="0.4"
        />

        <path
          d="M32 49v8M24 57h16"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (avatar === 'road-cone') {
    return (
      <svg {...sharedProps}>
        <path
          d="M27 9h10l8 38H19L27 9Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <path
          d="M23 28h18M20 42h24"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <path
          d="M13 52h38"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (avatar === 'chequered-flag') {
    return (
      <svg {...sharedProps}>
        <path
          d="M16 8v48"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <path
          d="M18 11c11-6 19 6 30 0v25c-11 6-19-6-30 0V11Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <path
          d="M18 11h10v12H18M38 11v12h10M28 23h10v13H28"
          fill="#ffffff"
        />
      </svg>
    )
  }

  if (avatar === 'navigation-pin') {
    return (
      <svg {...sharedProps}>
        <path
          d="M32 57S14 42 14 25a18 18 0 1 1 36 0c0 17-18 32-18 32Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <circle
          cx="32"
          cy="25"
          r="7"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
        />
      </svg>
    )
  }

  if (avatar === 'star') {
    return (
      <svg {...sharedProps}>
        <path
          d="m32 8 7 15 17 2-12 12 3 17-15-8-15 8 3-17L8 25l17-2 7-15Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg {...sharedProps}>
      <path
        d="M37 6 15 35h15l-3 23 22-31H34l3-21Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default AvatarIcon