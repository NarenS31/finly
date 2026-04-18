"use client";

import { useMemo, useState } from "react";
import { useCurrencyStore } from "@/lib/store/currency-store";
import { formatMoney } from "@/lib/utils/format-currency";

export function SavingsGoalCalc() {
  const symbol = useCurrencyStore((s) => s.currency.symbol);
  const [goal, setGoal] = useState(2000);
  const [monthly, setMonthly] = useState(120);
  const [rate, setRate] = useState(5);

  const { months, totalInterest } = useMemo(() => {
    let balance = 0;
    let interest = 0;
    let m = 0;
    const r = rate / 1200;
    while (balance < goal && m < 600) {
      const before = balance;
      balance = balance * (1 + r) + monthly;
      interest += balance - before - monthly;
      m += 1;
    }
    return { months: m, totalInterest: Math.max(0, Math.round(interest)) };
  }, [goal, monthly, rate]);

  const milestones = useMemo(() => {
    if (months === 0) return [0];
    const q = Math.floor(months / 4);
    return [q, q * 2, q * 3, months].filter((v, i, a) => v > 0 && a.indexOf(v) === i);
  }, [months]);

  return (
    <div className="my-6 rounded-[var(--radius-card-teen)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] md:p-6">
      <p className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">Savings goal</p>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          Goal amount
          <input
            type="number"
            min={1}
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          Monthly saving
          <input
            type="number"
            min={1}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          Annual rate (0–10%)
          <input
            type="range"
            min={0}
            max={10}
            step={0.25}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-primary)]"
          />
          <span>{rate}%</span>
        </label>
      </div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <p className="rounded-xl bg-[var(--color-primary-light)] px-4 py-3 font-medium">
          Months to goal: <strong>{months}</strong> (~{Math.round((months / 12) * 10) / 10} years)
        </p>
        <p className="rounded-xl bg-[var(--color-secondary-light)] px-4 py-3 font-medium">
          Interest earned (approx.): <strong>{formatMoney(totalInterest, symbol)}</strong>
        </p>
      </div>
      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Timeline</p>
        <div className="relative h-4 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-[width] duration-700 ease-out"
            style={{ width: "100%" }}
          />
          {milestones.map((m) => (
            <span
              key={m}
              title={`Month ${m}`}
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--color-accent)] shadow"
              style={{ left: `${Math.min(100, (m / Math.max(months, 1)) * 100)}%`, transform: "translate(-50%, -50%)" }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>Start</span>
          <span>Month {months}</span>
        </div>
      </div>
    </div>
  );
}
