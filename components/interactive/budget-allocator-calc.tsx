"use client";

import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrencyStore } from "@/lib/store/currency-store";
import { formatMoney } from "@/lib/utils/format-currency";

const labels = ["Needs", "Wants", "Savings", "Emergency fund"] as const;
const colors = ["#5c6bc0", "#ff7043", "#26a69a", "#3949ab"];

function normalize(weights: number[]) {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  return weights.map((w) => Math.round((w / sum) * 100));
}

export function BudgetAllocatorCalc() {
  const { symbol, exampleIncome } = useCurrencyStore((s) => s.currency);
  const [mounted] = useState(() => typeof window !== "undefined");
  const [income, setIncome] = useState<number>(exampleIncome);
  const [weights, setWeights] = useState([50, 30, 12, 8]);

  const pct = useMemo(() => normalize(weights), [weights]);
  const savingsPct = pct[2] + pct[3];
  const score = Math.max(
    0,
    100 - (Math.abs(pct[0] - 50) + Math.abs(pct[1] - 30) + Math.abs(savingsPct - 20))
  );

  const data = useMemo(
    () => labels.map((name, i) => ({ name, value: Math.round((income * pct[i]) / 100) })),
    [income, pct]
  );

  function setWeight(i: number, v: number) {
    const next = [...weights];
    next[i] = v;
    setWeights(next);
  }

  return (
    <div className="my-6 rounded-[var(--radius-card-teen)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] md:p-6">
      <p className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">Budget allocator</p>
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
        Split a monthly income across needs, wants, savings, and a small emergency slice. We normalize your sliders to
        100%.
      </p>
      <label className="mb-4 grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
        Monthly income (editable)
        <input
          type="number"
          min={50}
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text-primary)]"
        />
        <span className="text-xs text-[var(--color-text-muted)]">Default follows your currency setting.</span>
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        {labels.map((label, i) => (
          <label key={label} className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
            {label}: {pct[i]}% → {formatMoney(Math.round((income * pct[i]) / 100), symbol)}
            <input
              type="range"
              min={0}
              max={100}
              value={weights[i]}
              onChange={(e) => setWeight(i, Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </label>
        ))}
      </div>
      {savingsPct < 10 && (
        <p className="mt-3 rounded-xl border border-[var(--color-warning)] bg-[var(--color-warning-light)] px-3 py-2 text-sm font-medium text-[var(--color-text-primary)]">
          Savings + emergency are under 10%. Try nudging more toward future-you.
        </p>
      )}
      <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
        Your <strong className="text-[var(--color-text-primary)]">50/30/20 similarity score</strong>:{" "}
        <strong>{Math.round(score)}</strong> / 100 (100 = exact match to 50% needs, 30% wants, 20% savings+emergency).
      </p>
      <div className="mt-4 h-56 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatMoney(Number(v), symbol)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="skeleton-shimmer h-full rounded-2xl" />
        )}
      </div>
    </div>
  );
}
