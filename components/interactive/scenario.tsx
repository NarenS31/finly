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
    <div className="my-6 rounded-[16px] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)]">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
      <div className="mt-3 grid gap-2">
        {safeOptions.map((option, i) => (
          <button
            key={option.label}
            onClick={() => setActive(i)}
            className="rounded-[12px] border border-[var(--color-border)] px-3 py-2 text-left text-sm hover:bg-zinc-50"
          >
            {option.label}
          </button>
        ))}
      </div>
      {active !== null && safeOptions[active] && (
        <p className="mt-3 rounded-[12px] bg-zinc-100 p-3 text-sm">{safeOptions[active].consequence}</p>
      )}
    </div>
  );
}
