// Local type for SVG props if not imported from elsewhere
type IconSVGProps = React.SVGProps<SVGSVGElement> & { className?: string };
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
};
