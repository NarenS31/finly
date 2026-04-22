export const Icon = {
  Flex: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M4 14c0-2 2-4 6-4s6 2 6 4" stroke="#0f766e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 10v-2a2 2 0 1 1 4 0v2" stroke="#0f766e" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="16" r="2" fill="#0f766e" />
    </svg>
  ),
  Budget: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="3" y="10" width="3" height="7" rx="1" fill="currentColor" />
      <rect x="8.5" y="6" width="3" height="11" rx="1" fill="currentColor" />
      <rect x="14" y="3" width="3" height="14" rx="1" fill="currentColor" opacity={0.5} />
      <path
        d="M3 13.5l6-5 5 3 3-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  CompoundInterest: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 3.5C5 5 3.5 7.3 3.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
    </svg>
  ),

  Debt: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="2" y="6" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 9.5h16" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="12" width="4" height="2" rx="1" fill="currentColor" />
      <path d="M6 4h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
    </svg>
  ),

  Bank: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="3" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="12" r="2" fill="currentColor" />
    </svg>
  ),

  Saving: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M16 10a6 6 0 11-12 0 6 6 0 0112 0z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 7v3l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 4l2-2M6 4L4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
    </svg>
  ),

  Tax: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  Investing: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path
        d="M3 14l4-4 3 3 4-5 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 7h2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Goals: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" opacity={0.5} />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  ),

  Arrow: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Check: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Star: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path
        d="M10 2l2.4 5h5.3l-4.3 3.1 1.6 5.2L10 12.2l-5 3.1 1.6-5.2L2.3 7h5.3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  StarFilled: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden {...p}>
      <path d="M10 2l2.4 5h5.3l-4.3 3.1 1.6 5.2L10 12.2l-5 3.1 1.6-5.2L2.3 7h5.3z" />
    </svg>
  ),

  Flame: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path
        d="M10 2c0 0 5 5 5 10a5 5 0 01-10 0c0-2.5 1.2-4.3 2.5-5.5 0 1.8 1.2 3 2.5 3C10 7 10 2 10 2z"
        fill="#f97316"
      />
      <path
        d="M10 11c0 0 2.5-1.5 2.5-4.5.8 1.2 1.5 2.5 1.5 4.5a4 4 0 01-8 0c0-1.2.3-2.2 1-3 0 1.2.8 2 2 2.5 0-1-.3-2.5-1-4C9 8 10 11 10 11z"
        fill="#fbbf24"
      />
    </svg>
  ),

  Lock: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  Globe: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 3c-2 2-3 4.3-3 7s1 5 3 7M10 3c2 2 3 4.3 3 7s-1 5-3 7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),

  BookOpen: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M3 5a2 2 0 012-2h4.5v14H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 5a2 2 0 00-2-2h-4.5v14H15a2 2 0 002-2V5z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),

  Trophy: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M7 3h6v6a3 3 0 01-6 0V3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 4H7M13 4h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 4c0 3 1.5 4.5 3 5M16 4c0 3-1.5 4.5-3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 12v3M7 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  Lightning: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden {...p}>
      <path d="M11 2L4 11h6l-1 7 7-9h-6l1-7z" />
    </svg>
  ),

  Share: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="15" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9l6-3M7 11l6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  Sun: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2v2M10 16v2M2 10h2M16 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M4.9 15.1l1.4-1.4M13.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  Moon: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M17 10.5A7 7 0 119.5 3a5 5 0 007.5 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  Menu: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  Close: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  ChevronRight: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M7 5l6 5-6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Search: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  X: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  ChevronDown: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M5 7l5 6 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
