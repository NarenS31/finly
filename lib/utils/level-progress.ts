import type { LevelName } from "@/types";

export const LEVEL_TIERS: { name: LevelName; min: number; max: number }[] = [
  { name: "Beginner", min: 0, max: 99 },
  { name: "Saver", min: 100, max: 299 },
  { name: "Investor", min: 300, max: 699 },
  { name: "Finance Pro", min: 700, max: 1499 },
  { name: "Money Master", min: 1500, max: Number.POSITIVE_INFINITY },
];

export function getLevelProgress(xp: number) {
  let tier = LEVEL_TIERS[0];
  for (const t of LEVEL_TIERS) {
    if (xp >= t.min) tier = t;
  }
  const idx = LEVEL_TIERS.findIndex((t) => t.name === tier.name);
  const next = idx < LEVEL_TIERS.length - 1 ? LEVEL_TIERS[idx + 1] : null;
  const currentMin = tier.min;
  const nextMin = next?.min ?? null;
  const span = nextMin != null ? nextMin - currentMin : 1;
  const pctInTier = nextMin != null ? Math.min(1, Math.max(0, (xp - currentMin) / span)) : 1;
  return {
    level: tier.name,
    currentMin,
    nextMin,
    nextName: next?.name ?? null,
    pctInTier,
  };
}
