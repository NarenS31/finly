"use client";

export type FinnMood = "happy" | "excited" | "sad" | "thinking" | "cool" | "love";

// Mouth paths per mood
const MOUTH: Record<FinnMood, React.ReactNode> = {
  happy:    <path d="M34 54 Q40 60 46 54" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />,
  excited:  <path d="M33 53 Q40 62 47 53" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />,
  sad:      <path d="M34 58 Q40 52 46 58" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />,
  thinking: <path d="M36 55 Q40 56 44 53" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />,
  cool:     <path d="M34 55 Q40 60 46 55" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />,
  love:     <path d="M34 54 Q40 62 46 54" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" />,
};

// Eye overrides per mood
const EYES: Record<FinnMood, React.ReactNode> = {
  happy: (
    <>
      <ellipse cx="30" cy="40" rx="5" ry="5.5" fill="#1c1917" />
      <ellipse cx="50" cy="40" rx="5" ry="5.5" fill="#1c1917" />
      <circle cx="32" cy="38" r="1.8" fill="white" />
      <circle cx="52" cy="38" r="1.8" fill="white" />
    </>
  ),
  excited: (
    <>
      {/* Wide open eyes with bigger shine */}
      <ellipse cx="30" cy="40" rx="6" ry="6.5" fill="#1c1917" />
      <ellipse cx="50" cy="40" rx="6" ry="6.5" fill="#1c1917" />
      <circle cx="32" cy="37.5" r="2.2" fill="white" />
      <circle cx="52" cy="37.5" r="2.2" fill="white" />
    </>
  ),
  sad: (
    <>
      {/* Droopy eyes */}
      <ellipse cx="30" cy="41" rx="5" ry="4.5" fill="#1c1917" />
      <ellipse cx="50" cy="41" rx="5" ry="4.5" fill="#1c1917" />
      <circle cx="32" cy="39.5" r="1.8" fill="white" />
      <circle cx="52" cy="39.5" r="1.8" fill="white" />
      {/* Teardrop */}
      <ellipse cx="27" cy="46" rx="1.2" ry="1.8" fill="#93c5fd" opacity="0.8" />
    </>
  ),
  thinking: (
    <>
      <ellipse cx="30" cy="40" rx="5" ry="5.5" fill="#1c1917" />
      {/* One eye partially closed / squinting */}
      <ellipse cx="50" cy="41" rx="5" ry="3.5" fill="#1c1917" />
      <circle cx="32" cy="38" r="1.8" fill="white" />
      <circle cx="52" cy="39.5" r="1.5" fill="white" />
      {/* Thought dots */}
      <circle cx="55" cy="28" r="1.5" fill="#1c1917" opacity="0.3" />
      <circle cx="59" cy="23" r="2" fill="#1c1917" opacity="0.3" />
      <circle cx="64" cy="17" r="2.8" fill="#1c1917" opacity="0.2" />
    </>
  ),
  cool: (
    <>
      {/* Sunglasses */}
      <rect x="23" y="36" width="12" height="8" rx="3" fill="#0f172a" />
      <rect x="45" y="36" width="12" height="8" rx="3" fill="#0f172a" />
      <line x1="35" y1="40" x2="45" y2="40" stroke="#0f172a" strokeWidth="2" />
      <circle cx="27" cy="39" r="2" fill="#334155" opacity="0.6" />
      <circle cx="49" cy="39" r="2" fill="#334155" opacity="0.6" />
    </>
  ),
  love: (
    <>
      {/* Heart eyes */}
      <path d="M25 37 C25 34 29 34 29 37 C29 40 25 43 25 43 C25 43 21 40 21 37 C21 34 25 34 25 37Z" fill="#e11d48" transform="translate(3,0)" />
      <path d="M25 37 C25 34 29 34 29 37 C29 40 25 43 25 43 C25 43 21 40 21 37 C21 34 25 34 25 37Z" fill="#e11d48" transform="translate(23,0)" />
    </>
  ),
};

export function Finn({
  size = 40,
  className = "",
  mood = "happy",
}: {
  size?: number;
  className?: string;
  mood?: FinnMood;
}) {
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

      {/* Eyes — mood-driven */}
      {EYES[mood]}

      {/* Nose */}
      <ellipse cx="40" cy="49" rx="3" ry="2" fill="#1c1917" />

      {/* Mouth — mood-driven */}
      {MOUTH[mood]}

      {/* Inner ear detail */}
      <line x1="40" y1="49" x2="34" y2="54" stroke="#1c1917" strokeWidth="1" opacity="0.4" />
      <line x1="40" y1="49" x2="46" y2="54" stroke="#1c1917" strokeWidth="1" opacity="0.4" />

      {/* Forehead stripe */}
      <path d="M36 28 Q40 24 44 28" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}
