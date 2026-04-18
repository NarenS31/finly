"use client";

import { useMemo, useState } from "react";
import { useCurrencyStore } from "@/lib/store/currency-store";
import { formatMoney } from "@/lib/utils/format-currency";

function simulate(debt: number, rateApr: number, monthlyPay: number, maxMonths = 600) {
  let bal = debt;
  let interestPaid = 0;
  let m = 0;
  const r = rateApr / 1200;
  while (bal > 0.01 && m < maxMonths) {
    const interest = bal * r;
    interestPaid += interest;
    bal = bal + interest - monthlyPay;
    m += 1;
    if (monthlyPay <= bal * r + 0.0001 && m > 2 && bal >= debt * 0.999) {
      return { months: Infinity as number, interestPaid: Infinity as number };
    }
  }
  return { months: m, interestPaid: Math.round(interestPaid) };
}

export function DebtPayoffCalc() {
  const symbol = useCurrencyStore((s) => s.currency.symbol);
  const [debt, setDebt] = useState(2400);
  const [rate, setRate] = useState(18);
  const [minimum, setMinimum] = useState(60);
  const [extra, setExtra] = useState(40);

  const minOnly = useMemo(() => simulate(debt, rate, minimum), [debt, rate, minimum]);
  const withExtra = useMemo(() => simulate(debt, rate, minimum + extra), [debt, rate, minimum, extra]);

  const maxM = Math.min(120, Math.max(minOnly.months === Infinity ? 120 : minOnly.months, withExtra.months));
  const barMin = minOnly.months === Infinity ? 100 : Math.min(100, (minOnly.months / maxM) * 100);
  const barExtra = Math.min(100, (withExtra.months / maxM) * 100);

  return (
    <div className="my-6 rounded-[var(--radius-card-teen)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] md:p-6">
      <p className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">Debt payoff</p>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          Balance
          <input
            type="number"
            value={debt}
            onChange={(e) => setDebt(Number(e.target.value))}
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          APR %
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          Minimum payment / month
          <input
            type="number"
            value={minimum}
            onChange={(e) => setMinimum(Number(e.target.value))}
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
          Extra payment / month
          <input
            type="number"
            value={extra}
            onChange={(e) => setExtra(Number(e.target.value))}
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
          />
        </label>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Minimum only</p>
          <p className="mt-2 text-2xl font-bold">
            {minOnly.months === Infinity ? "Never" : `${minOnly.months} mo`}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Est. interest: {minOnly.interestPaid === Infinity ? "—" : formatMoney(minOnly.interestPaid, symbol)}
          </p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--color-border)]">
            <div className="h-full rounded-full bg-[var(--color-warning)] transition-all duration-500" style={{ width: `${barMin}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-secondary)] bg-[var(--color-secondary-light)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Minimum + extra</p>
          <p className="mt-2 text-2xl font-bold">{withExtra.months} mo</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Est. interest: {formatMoney(withExtra.interestPaid, symbol)}
          </p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/60">
            <div className="h-full rounded-full bg-[var(--color-secondary)] transition-all duration-500" style={{ width: `${barExtra}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
