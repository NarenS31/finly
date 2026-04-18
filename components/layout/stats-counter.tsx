"use client";

import { useEffect, useState } from "react";

function animateTo(target: number, set: (value: number) => void) {
  const duration = 1000;
  const start = performance.now();

  function frame(now: number) {
    const progress = Math.min(1, (now - start) / duration);
    set(Math.floor(progress * target));
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

export function StatsCounter({
  users,
  countries,
}: {
  users: number;
  countries: number;
}) {
  const [u, setU] = useState(0);
  const [c, setC] = useState(0);

  useEffect(() => {
    animateTo(users, setU);
    animateTo(countries, setC);
  }, [users, countries]);

  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
      <span className="flex items-baseline gap-2">
        <span className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {u.toLocaleString()}
        </span>
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">students</span>
      </span>
      <span className="flex items-baseline gap-2">
        <span className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {c.toLocaleString()}
        </span>
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">countries</span>
      </span>
    </div>
  );
}
