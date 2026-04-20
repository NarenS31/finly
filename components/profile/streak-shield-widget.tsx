"use client";

import { useState } from "react";

interface StreakShieldProps {
  shields: number;
  streakAtRisk?: boolean; // true if user missed yesterday
  onShieldUsed?: () => void;
}

export function StreakShieldWidget({ shields, streakAtRisk = false, onShieldUsed }: StreakShieldProps) {
  const [localShields, setLocalShields] = useState(shields);
  const [using, setUsing] = useState(false);
  const [used, setUsed] = useState(false);

  const useShield = async () => {
    if (localShields < 1 || using || used) return;
    setUsing(true);
    const res = await fetch("/api/streak-shield", { method: "POST" });
    const data = (await res.json()) as { ok?: boolean; shields_remaining?: number };
    if (data.ok) {
      setLocalShields(data.shields_remaining ?? 0);
      setUsed(true);
      onShieldUsed?.();
    }
    setUsing(false);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--white)] px-4 py-3">
      {/* Shield icons */}
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={`text-xl ${i < localShields ? "opacity-100" : "opacity-20"}`} aria-hidden>
            🛡️
          </span>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--black)]">
          {localShields} Streak Shield{localShields !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-[var(--gray-500)]">
          {localShields > 0
            ? "Use a shield to protect your streak when you miss a day"
            : "Earn shields by completing 5-day streaks"}
        </p>
      </div>
      {streakAtRisk && localShields > 0 && !used && (
        <button
          onClick={useShield}
          disabled={using}
          className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {using ? "…" : "Use Shield"}
        </button>
      )}
      {used && (
        <span className="shrink-0 rounded-lg bg-[var(--green-bg)] px-3 py-1.5 text-xs font-bold text-[var(--green-deeper)]">
          Streak saved! ✓
        </span>
      )}
    </div>
  );
}
