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
};
