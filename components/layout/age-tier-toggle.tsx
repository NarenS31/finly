"use client";

import { useAgeTierStore } from "@/lib/store/age-tier-store";

export function AgeTierToggle() {
  const ageTier = useAgeTierStore((s) => s.ageTier);
  const setAgeTier = useAgeTierStore((s) => s.setAgeTier);

  return (
    <div className="inline-flex rounded-[999px] border border-white/60 bg-white/90 p-1 text-xs shadow-sm backdrop-blur">
      {(["8-12", "13-17"] as const).map((tier) => (
        <button
          key={tier}
          onClick={() => setAgeTier(tier)}
          className={`rounded-[999px] px-3 py-1.5 font-semibold transition ${
            ageTier === tier
              ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-elevated)]"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          Ages {tier}
        </button>
      ))}
    </div>
  );
}
