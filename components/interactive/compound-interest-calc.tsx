"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { useCurrencyStore } from "@/lib/store/currency-store";
import { formatMoney } from "@/lib/utils/format-currency";

export function CompoundInterestCalc() {
  const symbol = useCurrencyStore((s) => s.currency.symbol);
  const [mounted] = useState(() => typeof window !== "undefined");
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    return Array.from({ length: years + 1 }, (_, year) => {
      const compound = principal * Math.pow(1 + rate / 100, year);
      const simple = principal + principal * (rate / 100) * year;
      return { year, compound: Math.round(compound), simple: Math.round(simple) };
    });
  }, [principal, rate, years]);

  const finalCompound = data[data.length - 1]?.compound ?? 0;
  const interestEarned = finalCompound - principal;

  return (
    <div className="my-6 rounded-[var(--radius-card-teen)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] md:p-6">
      <p className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">Compound interest</p>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          Principal
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <span className="text-[var(--color-text-primary)]">{formatMoney(principal, symbol)}</span>
        </label>
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          Annual rate
          <input
            type="range"
            min={1}
            max={20}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <span className="text-[var(--color-text-primary)]">{rate}%</span>
        </label>
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          Years
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <span className="text-[var(--color-text-primary)]">{years} yrs</span>
        </label>
      </div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <p className="rounded-xl bg-[var(--color-primary-light)] px-4 py-3 font-medium text-[var(--color-text-primary)]">
          Final amount: {formatMoney(finalCompound, symbol)}
        </p>
        <p className="rounded-xl bg-[var(--color-secondary-light)] px-4 py-3 font-medium text-[var(--color-text-primary)]">
          Interest earned: {formatMoney(interestEarned, symbol)}
        </p>
      </div>
      <div className="mt-4 h-56 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${symbol}${v}`} />
              <Tooltip formatter={(v) => formatMoney(Number(v), symbol)} />
              <Legend />
              <Line type="monotone" dataKey="compound" name="Compound" stroke="#5c6bc0" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="simple" name="Simple interest" stroke="#26a69a" strokeWidth={2} dot={false} strokeDasharray="6 4" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="skeleton-shimmer h-full rounded-2xl" />
        )}
      </div>
    </div>
  );
}
