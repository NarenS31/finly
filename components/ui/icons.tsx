type IconSVGProps = React.SVGProps<SVGSVGElement> & { className?: string };

export const Icon = {
  Sun: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="10" cy="10" r="4" stroke="#fbbf24" strokeWidth="1.5" fill="#fef9c3" />
      <g stroke="#fbbf24" strokeWidth="1.2">
        <line x1="10" y1="2" x2="10" y2="5" />
        <line x1="10" y1="15" x2="10" y2="18" />
        <line x1="2" y1="10" x2="5" y2="10" />
        <line x1="15" y1="10" x2="18" y2="10" />
        <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" />
        <line x1="13.7" y1="13.7" x2="15.8" y2="15.8" />
        <line x1="4.2" y1="15.8" x2="6.3" y2="13.7" />
        <line x1="13.7" y1="6.3" x2="15.8" y2="4.2" />
      </g>
    </svg>
  ),
  Moon: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M15 10a5 5 0 1 1-5-5c0 2.5 2.5 5 5 5z" fill="#fbbf24" stroke="#f59e42" strokeWidth="1.2" />
    </svg>
  ),
  Lock: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="5" y="9" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" fill="#f3f4f6" />
      <path d="M7 9V7a3 3 0 1 1 6 0v2" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13" r="1" fill="#a3a3a3" />
    </svg>
  ),
  Lightning: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <polygon points="11 2 3 12 10 12 9 18 17 8 10 8 11 2" fill="#fbbf24" stroke="#f59e42" strokeWidth="1.2" />
    </svg>
  ),
  Star: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <polygon points="10,2 12.5,7.5 18,8 14,12 15,18 10,15 5,18 6,12 2,8 7.5,7.5" fill="#fbbf24" stroke="#f59e42" strokeWidth="1.2" />
    </svg>
  ),
  Share: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="15" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" fill="#f3f4f6" />
      <circle cx="5" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="#f3f4f6" />
      <circle cx="15" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" fill="#f3f4f6" />
      <line x1="7.5" y1="8.5" x2="12.5" y2="6.5" stroke="#a3a3a3" strokeWidth="1.2" />
      <line x1="7.5" y1="11.5" x2="12.5" y2="13.5" stroke="#a3a3a3" strokeWidth="1.2" />
    </svg>
  ),
  X: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <line x1="6" y1="6" x2="14" y2="14" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="6" x2="6" y2="14" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Search: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="9" cy="9" r="6" stroke="#a3a3a3" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="18" y2="18" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  ChevronDown: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Tax: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="4" y="4" width="12" height="12" rx="3" fill="#f3f4f6" stroke="#a3a3a3" strokeWidth="1.5" />
      <text x="10" y="14" textAnchor="middle" fontSize="7" fill="#a3a3a3">%</text>
    </svg>
  ),
  StarFilled: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <polygon points="10,2 12.5,7.5 18,8 14,12 15,18 10,15 5,18 6,12 2,8 7.5,7.5" fill="#fbbf24" stroke="#f59e42" strokeWidth="1.2" />
    </svg>
  ),
  Check: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M5 10l4 4 6-8" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Globe: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="#e0f2fe" />
      <path d="M2 10h16" stroke="#0284c7" strokeWidth="1.2" />
      <path d="M10 2a16 16 0 0 1 0 16" stroke="#0284c7" strokeWidth="1.2" />
      <path d="M10 2a16 16 0 0 0 0 16" stroke="#0284c7" strokeWidth="1.2" />
    </svg>
  ),
  Flame: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M10 3C10 3 7 7 7 10a3 3 0 0 0 6 0c0-3-3-7-3-7z" fill="#fbbf24" stroke="#f59e42" strokeWidth="1.5" />
      <path d="M10 13a1.5 1.5 0 0 1-1.5-1.5c0-.8.7-2.1 1.5-3.5.8 1.4 1.5 2.7 1.5 3.5A1.5 1.5 0 0 1 10 13z" fill="#f59e42" />
    </svg>
  ),
  Arrow: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M13 5l-6 5 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Trophy: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="5" y="8" width="10" height="6" rx="2" fill="#fef9c3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 14v2" stroke="#f59e42" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6" r="3" fill="#fde68a" stroke="#f59e42" strokeWidth="1.5" />
    </svg>
  ),
  BookOpen: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="3" y="4" width="6" height="12" rx="2" fill="#f3f4f6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="4" width="6" height="12" rx="2" fill="#f3f4f6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 4v12" stroke="#6b7280" strokeWidth="1.5" />
    </svg>
  ),
  Goals: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="#f3f4f6" />
      <path d="M10 5v5l3 3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
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

  // File intentionally left empty to resolve build errors.

  Saving: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="#d1fae5" />
      <path d="M7 13l3-3 3 3" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Investing: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="4" y="4" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" fill="#fef3c7" />
      <path d="M10 13V7" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13" r="1" fill="#d97706" />
    </svg>
  ),
  Bank: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <rect x="3" y="8" width="14" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" fill="#e0f2fe" />
      <rect x="7" y="11" width="2" height="2" rx="0.5" fill="#0284c7" />
      <rect x="11" y="11" width="2" height="2" rx="0.5" fill="#0284c7" />
      <path d="M2 8l8-4 8 4" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  ChevronRight: (p: IconSVGProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden {...p}>
      <path d="M8 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
