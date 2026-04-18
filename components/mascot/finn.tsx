"use client";

export function Finn({ className = "" }: { className?: string }) {
  return (
    <div className={`finn-bounce inline-flex flex-col items-center ${className}`} aria-hidden>
      <svg viewBox="0 0 80 80" className="h-16 w-16 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="finnGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd54f" />
            <stop offset="100%" stopColor="#ffb300" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#finnGold)" stroke="#f9a825" strokeWidth="2" />
        <circle cx="30" cy="34" r="4" fill="#1a1a2e" />
        <circle cx="50" cy="34" r="4" fill="#1a1a2e" />
        <path
          d="M28 48 Q40 58 52 48"
          stroke="#1a1a2e"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className="mt-1 text-xs font-semibold text-[var(--color-primary-dark)]">Finn</span>
    </div>
  );
}
