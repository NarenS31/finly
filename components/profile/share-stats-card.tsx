"use client";

import { useState } from "react";

export function ShareStatsCard({
  displayName,
  xp,
  streak,
  level,
}: {
  displayName: string;
  xp: number;
  streak: number;
  level: string;
}) {
  const [state, setState] = useState<"idle" | "shared" | "copied">("idle");

  const handleShare = async () => {
    const params = new URLSearchParams({
      title: `${displayName} is on a ${streak}-day streak`,
      topic: level,
      xp: String(xp),
    });
    const shareUrl = `${window.location.origin}/api/og?${params.toString()}`;
    const text = `${displayName} has ${xp} XP, is a ${level}, and is on a ${streak}-day streak in Finly. Catch up.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Finly progress",
          text,
          url: shareUrl,
        });
        setState("shared");
        return;
      }

      await navigator.clipboard.writeText(`${text} ${shareUrl}`);
      setState("copied");
    } catch {
      setState("idle");
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 shadow-[var(--shadow-md)]">
      <p className="text-lg font-bold text-[var(--black)]">Share Your Stats</p>
      <p className="mt-1 text-sm text-[var(--gray-500)]">
        Turn your progress into a shareable challenge card.
      </p>
      <div className="mt-4 rounded-2xl border border-[var(--green-border)] bg-[var(--green-bg)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--green-deeper)]">Preview</p>
        <p className="mt-2 text-xl font-extrabold text-[var(--black)]">{xp} XP</p>
        <p className="mt-1 text-sm text-[var(--gray-700)]">
          {displayName} · {level} · {streak}-day streak
        </p>
      </div>
      <button
        type="button"
        onClick={handleShare}
        className="mt-4 w-full rounded-xl bg-[var(--green)] py-3 text-sm font-bold text-white hover:bg-[var(--green-dark)]"
      >
        {state === "idle" ? "Share challenge card" : state === "shared" ? "Shared" : "Copied"}
      </button>
    </div>
  );
}
