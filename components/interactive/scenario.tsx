"use client";

import { useState } from "react";

type Option = { label: string; consequence: string };

export function Scenario({
  title,
  description,
  options,
}: {
  title: string;
  description: string;
  options?: Option[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className="my-6 rounded-[16px] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
        Scenario
      </div>
      <h4 className="mt-1 text-base font-bold text-[var(--color-text-primary)]">{title}</h4>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
      <div className="mt-3 grid gap-2">
        {safeOptions.map((option, i) => (
          <button
            key={option.label}
            onClick={() => setActive(i)}
            className={`rounded-[12px] border px-4 py-3 text-left text-sm font-medium transition-all ${
              active === i
                ? "border-[var(--color-primary)] bg-teal-50 text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/50 hover:bg-teal-50/40"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {active !== null && safeOptions[active] && (
        <div className="mt-3 flex gap-2 rounded-[12px] border border-amber-200 bg-amber-50 p-3">
          <span className="mt-0.5 text-amber-500">→</span>
          <p className="text-sm font-medium text-amber-900">{safeOptions[active].consequence}</p>
        </div>
      )}
    </div>
  );
}
