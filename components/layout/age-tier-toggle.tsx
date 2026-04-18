"use client";

import { useAgeTierStore } from "@/lib/store/age-tier-store";

export function AgeTierToggle() {
  const ageTier = useAgeTierStore((s) => s.ageTier);
  const setAgeTier = useAgeTierStore((s) => s.setAgeTier);

  return (
    <div className="inline-flex gap-1 rounded-lg border border-[var(--border-strong)] bg-[var(--gray-50)] p-0.5">
      {(["8-12", "13-17"] as const).map((tier) => (
        <button
          key={tier}
          type="button"
          onClick={() => setAgeTier(tier)}
          className={`rounded-[8px] px-2.5 py-1.5 text-xs font-bold transition ${
            ageTier === tier
              ? "bg-[var(--black)] text-[var(--white)]"
              : "bg-transparent text-[var(--gray-500)] hover:text-[var(--black)]"
          }`}
        >
          {tier === "8-12" ? "8–12" : "13–17"}
        </button>
      ))}
    </div>
  );
}
