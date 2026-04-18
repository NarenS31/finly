"use client";

export function Finn({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={`finn-bounce inline-block ${className}`}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ears (pointed fox ears) */}
      <polygon points="14,38 8,8 30,26" fill="#f97316" />
      <polygon points="17,36 11,14 28,27" fill="#fed7aa" />
      <polygon points="66,38 72,8 50,26" fill="#f97316" />
      <polygon points="63,36 69,14 52,27" fill="#fed7aa" />

      {/* Head */}
      <ellipse cx="40" cy="44" rx="26" ry="24" fill="#fb923c" />

      {/* White cheek patch / muzzle area */}
      <ellipse cx="40" cy="54" rx="14" ry="11" fill="#fed7aa" />

      {/* Eyes */}
      <ellipse cx="30" cy="40" rx="5" ry="5.5" fill="#1c1917" />
      <ellipse cx="50" cy="40" rx="5" ry="5.5" fill="#1c1917" />
      {/* Eye shine */}
      <circle cx="32" cy="38" r="1.8" fill="white" />
      <circle cx="52" cy="38" r="1.8" fill="white" />
      {/* Tiny second shine */}
      <circle cx="28.5" cy="42" r="0.9" fill="white" opacity="0.7" />
      <circle cx="48.5" cy="42" r="0.9" fill="white" opacity="0.7" />

      {/* Nose */}
      <ellipse cx="40" cy="49" rx="3" ry="2" fill="#1c1917" />

      {/* Smile */}
      <path d="M34 54 Q40 60 46 54" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Inner ear detail */}
      <line x1="40" y1="49" x2="34" y2="54" stroke="#1c1917" strokeWidth="1" opacity="0.4" />
      <line x1="40" y1="49" x2="46" y2="54" stroke="#1c1917" strokeWidth="1" opacity="0.4" />

      {/* Forehead stripe */}
      <path d="M36 28 Q40 24 44 28" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}
