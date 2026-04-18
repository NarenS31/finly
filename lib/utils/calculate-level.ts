import type { LevelName } from "@/types";

const THRESHOLDS: { min: number; level: LevelName; next: number | null }[] = [
  { min: 0, level: "Beginner", next: 100 },
  { min: 100, level: "Saver", next: 300 },
  { min: 300, level: "Investor", next: 700 },
  { min: 700, level: "Finance Pro", next: 1500 },
  { min: 1500, level: "Money Master", next: null },
];

export function xpToLevel(xp: number): {
  level: LevelName;
  currentBandMin: number;
  nextBandMin: number | null;
  progressInBand: number;
} {
  let band = THRESHOLDS[0];
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i].min) {
      band = THRESHOLDS[i];
      break;
    }
  }
  const nextBandMin = band.next;
  const progressInBand =
    nextBandMin === null ? 1 : Math.min(1, (xp - band.min) / (nextBandMin - band.min));

  return {
    level: band.level,
    currentBandMin: band.min,
    nextBandMin,
    progressInBand,
  };
}

export function levelLabelFromXp(xp: number): LevelName {
  return xpToLevel(xp).level;
}
