"use client";

import { Icon } from "@/components/ui/icons";

export function StreakPill({ streak }: { streak: number }) {
  if (streak < 3) return null;
  return (
    <p className="streak-glow mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--orange)]/40 bg-[var(--orange-bg)] px-4 py-2 text-sm font-bold text-[var(--orange)]">
      <Icon.Flame className="h-4 w-4" />
      {streak}-day streak
    </p>
  );
}
