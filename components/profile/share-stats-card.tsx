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
        Turn your progress into a shareable collectible card.
      </p>
      <div
        className="mt-5 flex flex-col items-center rounded-3xl border-2 border-[var(--green)] bg-gradient-to-br from-[var(--green-bg)] via-white to-[var(--green-bg)] p-6 shadow-lg"
        style={{ minWidth: 260, maxWidth: 340 }}
      >
        <div className="flex w-full items-center justify-between">
          <span className="rounded-full bg-[var(--green)] px-3 py-1 text-xs font-bold text-white shadow">Collectible</span>
          <svg className="h-7 w-7 text-[var(--yellow-400)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.755l6.908-1.004L12 2.5l3.092 6.251L22 9.755l-5.007 4.367 1.179 6.873z" /></svg>
        </div>
        <p className="mt-4 text-3xl font-extrabold text-[var(--black)] drop-shadow-sm">{xp} XP</p>
        <p className="mt-2 text-base font-semibold text-[var(--green-deeper)]">{displayName}</p>
        <p className="mt-1 text-sm text-[var(--gray-700)]">{level} · {streak}-day streak</p>
      </div>
      <button
        type="button"
        onClick={handleShare}
        className="mt-6 w-full rounded-xl bg-[var(--green)] py-3 text-base font-bold text-white shadow-md hover:bg-[var(--green-dark)]"
      >
        {state === "idle" ? "Share challenge card" : state === "shared" ? "Shared" : "Copied"}
      </button>
    </div>
  );
}
