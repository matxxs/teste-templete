export function CloudSearchIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="200" cy="160" r="140" fill="currentColor" opacity="0.04" />
      <circle cx="200" cy="160" r="110" fill="currentColor" opacity="0.06" />

      {/* Cloud shape */}
      <ellipse cx="200" cy="145" rx="90" ry="55" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" />
      <ellipse cx="155" cy="155" rx="55" ry="40" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
      <ellipse cx="250" cy="150" rx="50" ry="38" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />

      {/* Search icon */}
      <circle cx="200" cy="190" r="28" fill="currentColor" opacity="0.15" />
      <circle cx="195" cy="186" r="12" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.4" fill="none" />
      <line x1="203" y1="194" x2="212" y2="203" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.4" strokeLinecap="round" />

      {/* Decorative dots */}
      <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.1" />
      <circle cx="310" cy="90" r="3" fill="currentColor" opacity="0.08" />
      <circle cx="320" cy="200" r="5" fill="currentColor" opacity="0.1" />
      <circle cx="80" cy="210" r="3.5" fill="currentColor" opacity="0.08" />
      <circle cx="280" cy="260" r="3" fill="currentColor" opacity="0.06" />
      <circle cx="120" cy="260" r="2.5" fill="currentColor" opacity="0.06" />
    </svg>
  )
}

export function ServerErrorIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="200" cy="160" r="140" fill="currentColor" opacity="0.04" />
      <circle cx="200" cy="160" r="110" fill="currentColor" opacity="0.06" />

      {/* Server rack */}
      <rect x="150" y="100" width="100" height="120" rx="8" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" />
      <rect x="160" y="112" width="80" height="24" rx="4" fill="currentColor" opacity="0.1" />
      <rect x="160" y="146" width="80" height="24" rx="4" fill="currentColor" opacity="0.1" />
      <rect x="160" y="180" width="80" height="24" rx="4" fill="currentColor" opacity="0.1" />

      {/* Server lights */}
      <circle cx="175" cy="124" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="175" cy="158" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="175" cy="192" r="3" fill="currentColor" opacity="0.15" />

      {/* Warning symbol */}
      <circle cx="200" cy="250" r="20" fill="currentColor" opacity="0.12" />
      <line x1="200" y1="240" x2="200" y2="252" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.35" strokeLinecap="round" />
      <circle cx="200" cy="258" r="1.5" fill="currentColor" opacity="0.35" />

      {/* Decorative dots */}
      <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.1" />
      <circle cx="310" cy="90" r="3" fill="currentColor" opacity="0.08" />
      <circle cx="320" cy="200" r="5" fill="currentColor" opacity="0.1" />
      <circle cx="80" cy="210" r="3.5" fill="currentColor" opacity="0.08" />
    </svg>
  )
}

export function ShieldLockIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="200" cy="160" r="140" fill="currentColor" opacity="0.04" />
      <circle cx="200" cy="160" r="110" fill="currentColor" opacity="0.06" />

      {/* Shield shape */}
      <path
        d="M200 80 L260 110 L260 180 C260 220 200 260 200 260 C200 260 140 220 140 180 L140 110 Z"
        fill="currentColor"
        opacity="0.08"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.12"
      />

      {/* Lock body */}
      <rect x="182" y="158" width="36" height="30" rx="4" fill="currentColor" opacity="0.15" />
      {/* Lock shackle */}
      <path
        d="M190 158 L190 145 C190 138 194 132 200 132 C206 132 210 138 210 145 L210 158"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Keyhole */}
      <circle cx="200" cy="172" r="4" fill="currentColor" opacity="0.3" />
      <rect x="198.5" y="174" width="3" height="6" rx="1" fill="currentColor" opacity="0.3" />

      {/* Decorative dots */}
      <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.1" />
      <circle cx="310" cy="90" r="3" fill="currentColor" opacity="0.08" />
      <circle cx="320" cy="200" r="5" fill="currentColor" opacity="0.1" />
      <circle cx="80" cy="210" r="3.5" fill="currentColor" opacity="0.08" />
    </svg>
  )
}

export function KeyExpiredIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="200" cy="160" r="140" fill="currentColor" opacity="0.04" />
      <circle cx="200" cy="160" r="110" fill="currentColor" opacity="0.06" />

      {/* Key shape */}
      <circle cx="170" cy="140" r="30" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" />
      <circle cx="170" cy="140" r="12" fill="currentColor" opacity="0.1" />
      <rect x="195" y="135" width="60" height="10" rx="2" fill="currentColor" opacity="0.12" />
      <rect x="235" y="145" width="8" height="15" rx="1" fill="currentColor" opacity="0.12" />
      <rect x="248" y="145" width="8" height="12" rx="1" fill="currentColor" opacity="0.12" />

      {/* Clock/Timer symbol */}
      <circle cx="230" cy="200" r="25" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
      <line x1="230" y1="185" x2="230" y2="200" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="230" y1="200" x2="240" y2="205" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />

      {/* X mark for expired */}
      <line x1="165" y1="195" x2="185" y2="215" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="185" y1="195" x2="165" y2="215" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" strokeLinecap="round" />

      {/* Decorative dots */}
      <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.1" />
      <circle cx="310" cy="90" r="3" fill="currentColor" opacity="0.08" />
      <circle cx="320" cy="200" r="5" fill="currentColor" opacity="0.1" />
      <circle cx="80" cy="210" r="3.5" fill="currentColor" opacity="0.08" />
    </svg>
  )
}
