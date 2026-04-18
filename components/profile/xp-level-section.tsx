"use client";

import { motion } from "framer-motion";
import { LevelBadge } from "@/components/profile/level-badge";
import { getLevelProgress } from "@/lib/utils/level-progress";

export function XpLevelSection({ xp, levelLabel }: { xp: number; levelLabel: string }) {
  const { level, nextMin, nextName, pctInTier, currentMin } = getLevelProgress(xp);
  const displayLevel = levelLabel || level;
  const toNext =
    nextMin != null && nextName
      ? `${xp} / ${nextMin} XP to ${nextName}`
      : `${xp} XP — max level`;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Level</p>
          <div className="mt-2">
            <LevelBadge level={displayLevel} xp={xp} showProgress={false} />
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">{toNext}</p>
      </div>
      {nextMin != null && (
        <div className="mt-4">
          <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
            <motion.div
              className="h-full rounded-full bg-[var(--color-primary)]"
              initial={{ width: 0 }}
              animate={{ width: `${pctInTier * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {currentMin}–{nextMin - 1} XP in {displayLevel}
          </p>
        </div>
      )}
    </div>
  );
}
