"use client";

import Image from "next/image";
import { type CardData, ANIMAL_META, ELEMENT_CONFIG, RARITY_META } from "@/lib/cards";
import { AnimalArt } from "./animal-art";

/* ── Element icon ── */
function ElementIcon({ element, size = 18 }: { element: string; size?: number }) {
  const cfg = ELEMENT_CONFIG[element as keyof typeof ELEMENT_CONFIG];
  const symbols: Record<string, JSX.Element> = {
    fire: (
      <svg viewBox="0 0 16 16" width={size - 4} height={size - 4}>
        <path d="M8 14 C4 14 2 11 2 8 C2 5 4 3 6 2 C5.5 4 6.5 5 8 5 C7 3.5 7.5 2 9 1 C10 3 11 4.5 10.5 6.5 C12 5.5 12.5 4 12 3 C14 5 14 8 13 10 C12 13 10 14 8 14Z" fill="white"/>
      </svg>
    ),
    grass: (
      <svg viewBox="0 0 16 16" width={size - 4} height={size - 4}>
        <path d="M8 14 L8 6 M8 14 C8 14 4 10 4 6 C6 8 8 8 8 8 M8 14 C8 14 12 10 12 6 C10 8 8 8 8 8 M8 6 L6 2 M8 6 L10 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    water: (
      <svg viewBox="0 0 16 16" width={size - 4} height={size - 4}>
        <path d="M8 2 C8 2 3 8 3 10.5 C3 13 5.2 15 8 15 C10.8 15 13 13 13 10.5 C13 8 8 2 8 2Z" fill="white"/>
      </svg>
    ),
    lightning: (
      <svg viewBox="0 0 16 16" width={size - 4} height={size - 4}>
        <path d="M10 1 L5 9 L8.5 9 L6 15 L13 6 L9.5 6 Z" fill="white"/>
      </svg>
    ),
    psychic: (
      <svg viewBox="0 0 16 16" width={size - 4} height={size - 4}>
        <path d="M8 2 L9.2 5.8 L13 5.8 L10 8.2 L11.1 12 L8 9.8 L4.9 12 L6 8.2 L3 5.8 L6.8 5.8 Z" fill="white"/>
      </svg>
    ),
    fighting: (
      <svg viewBox="0 0 16 16" width={size - 4} height={size - 4}>
        <rect x="3" y="6" width="10" height="6" rx="2" fill="white"/>
        <rect x="5" y="4" width="6" height="4" rx="1.5" fill="white"/>
        <rect x="6" y="2" width="4" height="3" rx="1" fill="white"/>
      </svg>
    ),
    colorless: (
      <svg viewBox="0 0 16 16" width={size - 4} height={size - 4}>
        <circle cx="8" cy="8" r="5.5" fill="none" stroke="white" strokeWidth="2"/>
        <circle cx="8" cy="8" r="2" fill="white"/>
      </svg>
    ),
  };
  // const symbols = { ... };
  return (
    <span
      className="inline-flex items-center justify-center rounded-full"
      style={{ width: size, height: size, background: cfg.iconBg, flexShrink: 0 }}
    >
      {symbols[element] ?? symbols.colorless}
    </span>
  );
}

/* ── Energy cost dots ── */
function EnergyCost({ element, count }: { element: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <ElementIcon key={i} element={element} size={16} />
      ))}
    </span>
  );
}

/* ── Rarity stars ── */
function RarityStars({ count, color }: { count: number; color: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <svg key={i} width="9" height="9" viewBox="0 0 10 10">
          <polygon
            points="5,0.5 6.5,3.5 10,4 7.5,6.5 8.1,10 5,8.2 1.9,10 2.5,6.5 0,4 3.5,3.5"
            fill={i < count ? color : "none"}
            stroke={color}
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </span>
  );
}

/* ── Bokeh background circles ── */
function Bokeh({ colors }: { colors: string[] }) {
  const circles = [
    { cx: 15,  cy: 130, r: 28 },
    { cx: 170, cy: 15,  r: 34 },
    { cx: 155, cy: 120, r: 22 },
    { cx: 35,  cy: 22,  r: 18 },
    { cx: 125, cy: 145, r: 20 },
    { cx: 90,  cy: 10,  r: 14 },
    { cx: 180, cy: 75,  r: 16 },
    { cx: 8,   cy: 70,  r: 12 },
  ];
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 155" preserveAspectRatio="xMidYMid slice">
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={colors[i % colors.length]} />
      ))}
    </svg>
  );
}

/* ── Main card ── */
export function AnimalCard({
  card,
  size = "md",
  imageSrc,
}: {
  card: CardData;
  size?: "sm" | "md" | "lg";
  imageSrc?: string;
}) {
  const animal  = ANIMAL_META[card.animal];
  const element = ELEMENT_CONFIG[animal.element];
  const W = { sm: 174, md: 240, lg: 300 }[size];
  const H = { sm: 243, md: 336, lg: 420 }[size];
  const scale = W / 240;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: W, height: H }}
    >
      {/* Premium shadow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[18px]"
        style={{
          boxShadow: `0 8px 32px -4px rgba(31,41,55,0.18), 0 1.5px 8px 0 rgba(31,41,55,0.10)`
        }}
        aria-hidden
      />

      {/* Card shell */}
      <div
        className="relative overflow-hidden rounded-[18px] transition-transform duration-200 hover:scale-[1.03] cursor-pointer border border-[var(--color-border)] bg-white"
        style={{
          width: W,
          height: H,
        }}
      >
        {/* Card name only */}
        <div
          className="flex items-center justify-center px-4 pt-5 pb-2"
        >
          <span
            className="font-black text-center text-[1.35rem] tracking-tight"
            style={{
              color: element.textDark,
              textShadow: "0 1px 0 rgba(255,255,255,0.5)",
              letterSpacing: '-0.04em',
            }}
          >
            {card.name}
          </span>
        </div>

        {/* ── ART FRAME ── */}
        <div
          className="relative overflow-hidden mx-4"
          style={{
            height: Math.round(scale * 144),
            marginTop: scale * 4,
            borderRadius: scale * 12,
            background: 'linear-gradient(135deg, #f0fdf4 60%, #e0f2fe 100%)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          }}
        >
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={ANIMAL_META[card.animal].label}
                fill
                className="object-contain p-2 drop-shadow-lg"
              />
            ) : (
              <AnimalArt animal={card.animal} />
            )}
          </div>
        </div>

        {/* Art caption */}
        <div
          className="mx-4 flex items-center justify-between px-2"
          style={{
            height: scale * 16,
            background: "rgba(255,255,255,0.7)",
            borderRadius: `0 0 ${scale * 8}px ${scale * 8}px`,
            marginTop: -1,
          }}
        >
          <span style={{ fontSize: scale * 8, color: "#0f766e", fontWeight: 700 }}>
            {animal.label}
          </span>
          <span style={{ fontSize: scale * 7, color: "#64748b" }}>
            {card.category}
          </span>
        </div>

        {/* No stats, just a clean divider */}
        <div
          className="mx-4"
          style={{
            marginTop: scale * 8,
            height: 1,
            background: "#e5e7eb",
            borderRadius: 2,
          }}
        />

        {/* No footer stats or number strip */}
      </div>

      <style>{`
        @keyframes finnLegendaryShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
