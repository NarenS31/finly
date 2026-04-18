"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const LEVEL_STYLES: Record<string, string> = {
  Beginner: "bg-zinc-400/25 text-zinc-800 dark:text-zinc-100",
  Saver: "bg-[var(--color-secondary-light)] text-[var(--color-secondary)]",
  Investor: "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]",
  "Finance Pro": "bg-[var(--color-accent-light)] text-[var(--color-accent)]",
  "Money Master": "bg-[#F59E0B]/25 text-[#B45309] dark:text-amber-100",
};

export function LevelBadge({
  level,
  xp,
  showProgress,
  currentMin,
  nextMin,
}: {
  level: string;
  xp: number;
  showProgress?: boolean;
  currentMin?: number;
  nextMin?: number | null;
}) {
  const style = LEVEL_STYLES[level] ?? LEVEL_STYLES.Beginner;
  const pct =
    showProgress && nextMin != null && currentMin != null && nextMin > currentMin
      ? Math.min(1, (xp - currentMin) / (nextMin - currentMin))
      : 0;

  return (
    <div className="space-y-2">
      <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", style)}>{level}</span>
      {showProgress && nextMin != null && (
        <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-[var(--color-border)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}
    </div>
  );
}
