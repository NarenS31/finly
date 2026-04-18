"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, active: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    function frame(now: number) {
      const t = Math.min(1, (now - start) / duration);
      setV(Math.floor(t * target));
      if (t < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return v;
}

export function StatsBar({
  lessonsCompleted,
  students,
  countries,
}: {
  lessonsCompleted: number;
  students: number;
  countries: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const lc = useCountUp(lessonsCompleted, active);
  const st = useCountUp(students, active);
  const co = useCountUp(countries, active);

  return (
    <div
      ref={ref}
      className="grid gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8 shadow-[var(--shadow-md)] sm:grid-cols-3"
    >
      <div>
        <p className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
          {lc.toLocaleString()}
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">Lessons completed</p>
      </div>
      <div>
        <p className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
          {st.toLocaleString()}
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">Students learning</p>
      </div>
      <div>
        <p className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
          {co.toLocaleString()}
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">Countries reached</p>
      </div>
    </div>
  );
}
