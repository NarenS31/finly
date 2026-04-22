"use client";

export type FinnMood = "happy" | "excited" | "sad" | "thinking" | "cool" | "love";

const D = "#2C1300";
const CR = "#FFF5E0";
const SW = 3.8;

function Eyes({ mood }: { mood: FinnMood }) {
  if (mood === "love") return (
    <>
      <path d="M34 45 C34 41 40 41 40 45 C40 49 34 53 34 53 C34 53 28 49 28 45 C28 41 34 41 34 45Z" fill="#e11d48" />
      <path d="M70 45 C70 41 76 41 76 45 C76 49 70 53 70 53 C70 53 64 49 64 45 C64 41 70 41 70 45Z" fill="#e11d48" />
    </>
  );

  if (mood === "cool") return (
    <>
      <rect x="26" y="37" width="21" height="14" rx="5" fill="#0f172a" stroke={D} strokeWidth="2" />
      <rect x="61" y="37" width="21" height="14" rx="5" fill="#0f172a" stroke={D} strokeWidth="2" />
      <line x1="47" y1="44" x2="61" y2="44" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="33" cy="43" r="3.2" fill="#334155" opacity="0.4" />
      <circle cx="68" cy="43" r="3.2" fill="#334155" opacity="0.4" />
    </>
  );

  const rl = mood === "sad" ? 7.5 : mood === "excited" ? 9.5 : 8.5;
  const rr = mood === "thinking" ? 6 : rl;
  const adj = mood === "sad" ? 1.5 : 0;
  const shine = mood === "excited" ? 3.8 : 3.2;

  return (
    <>
      <circle cx="38" cy={44 + adj} r={rl} fill={D} />
      <circle cx="70" cy={44 + adj} r={rr} fill={D} />
      <circle cx="41.5" cy={41 + adj} r={shine} fill="white" />
      <circle cx="73.5" cy={41 + adj} r={shine} fill="white" />
      <circle cx="39" cy={47.5 + adj} r="1.5" fill="white" opacity="0.4" />
      <circle cx="71" cy={47.5 + adj} r="1.5" fill="white" opacity="0.4" />
      {mood === "sad" && <ellipse cx="30" cy="55" rx="2.2" ry="3.2" fill="#93c5fd" opacity="0.9" />}
    </>
  );
}

function Brows({ mood }: { mood: FinnMood }) {
  if (mood === "sad") return (
    <>
      <path d="M26 36 Q33 30 40 34" stroke={D} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M68 34 Q75 30 82 36" stroke={D} strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </>
  );
  if (mood === "excited") return (
    <>
      <path d="M27 32 Q34 27 40 31" stroke={D} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M68 31 Q75 27 81 32" stroke={D} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  );
  if (mood === "thinking") return (
    <>
      <path d="M27 33 Q33 31 40 35" stroke={D} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M68 31 Q75 35 81 31" stroke={D} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  );
  return (
    <>
      <path d="M27 33 Q34 29 40 33" stroke={D} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.45" />
      <path d="M68 33 Q75 29 81 33" stroke={D} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.45" />
    </>
  );
}

function Mouth({ mood }: { mood: FinnMood }) {
  const c = mood === "love" ? "#e11d48" : D;
  if (mood === "sad") return <path d="M46 70 Q54 64 62 70" stroke={c} strokeWidth="3" strokeLinecap="round" fill="none" />;
  if (mood === "thinking") return <path d="M49 68 Q54 70 60 66" stroke={c} strokeWidth="2.8" strokeLinecap="round" fill="none" />;
  if (mood === "cool") return <path d="M48 68 Q54 72 60 68" stroke={c} strokeWidth="2.8" strokeLinecap="round" fill="none" />;
  if (mood === "excited") return (
    <>
      <path d="M44 67 Q54 78 64 67" stroke={c} strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M44 67 Q54 75 64 67" fill={CR} stroke="none" />
    </>
  );
  return <path d="M46 68 Q54 75 62 68" stroke={c} strokeWidth="3" strokeLinecap="round" fill="none" />;
}

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
      viewBox="0 0 110 125"
      className={`finn inline-block ${className}`}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="finnOG" cx="38%" cy="32%" r="68%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#F57A2E" />
          <stop offset="100%" stopColor="#C75010" />
        </radialGradient>
      </defs>

      {/* Tail — drawn first so body covers the base */}
      <path
        d="M 76 108 C 108 108 112 80 103 64 C 96 50 80 48 78 62 C 84 74 81 93 76 108 Z"
        fill="url(#finnOG)"
        stroke={D}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <ellipse cx="92" cy="58" rx="12" ry="10" fill={CR} stroke={D} strokeWidth="2.6" />

      {/* Body */}
      <ellipse cx="54" cy="100" rx="30" ry="23" fill="url(#finnOG)" stroke={D} strokeWidth={SW} />
      <ellipse cx="54" cy="99" rx="20" ry="17" fill={CR} />

      {/* Paws */}
      <ellipse cx="37" cy="117" rx="13" ry="8" fill="url(#finnOG)" stroke={D} strokeWidth={SW - 0.4} />
      <ellipse cx="71" cy="117" rx="13" ry="8" fill="url(#finnOG)" stroke={D} strokeWidth={SW - 0.4} />
      <path d="M31 117 Q37 120 43 117" stroke={D} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65" />
      <path d="M65 117 Q71 120 77 117" stroke={D} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65" />

      {/* Ears — behind head */}
      <path d="M 28 37 L 17 5 Q 40 9 45 30 Z" fill="url(#finnOG)" stroke={D} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 29 34 L 22 12 Q 39 14 42 28 Z" fill={CR} />
      <path d="M 80 37 L 91 5 Q 68 9 63 30 Z" fill="url(#finnOG)" stroke={D} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 79 34 L 86 12 Q 69 14 66 28 Z" fill={CR} />

      {/* Head */}
      <circle cx="54" cy="45" r="32" fill="url(#finnOG)" stroke={D} strokeWidth={SW} />

      {/* Muzzle */}
      <ellipse cx="43" cy="59" rx="13" ry="11" fill={CR} />
      <ellipse cx="65" cy="59" rx="13" ry="11" fill={CR} />
      <ellipse cx="54" cy="60" rx="9" ry="10" fill={CR} />

      <Eyes mood={mood} />
      <Brows mood={mood} />

      {/* Nose */}
      <path d="M49 64 Q54 69 59 64 Q59 59 54 58 Q49 59 49 64 Z" fill="#1A0800" />
      <circle cx="51.5" cy="61" r="1.5" fill="white" opacity="0.45" />

      <Mouth mood={mood} />

      {/* Whiskers */}
      <path d="M44 62 L23 58" stroke={D} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
      <path d="M44 65 L23 65" stroke={D} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
      <path d="M64 62 L85 58" stroke={D} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
      <path d="M64 65 L85 65" stroke={D} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />

      {mood === "thinking" && (
        <>
          <circle cx="82" cy="33" r="2.2" fill={D} opacity="0.22" />
          <circle cx="89" cy="24" r="3" fill={D} opacity="0.18" />
          <circle cx="97" cy="14" r="4" fill={D} opacity="0.14" />
        </>
      )}
    </svg>
  );
}
