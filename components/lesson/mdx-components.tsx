"use client";

import React from "react";
import { slugifyHeading } from "@/lib/utils/content";
import { CompoundInterestCalc } from "@/components/interactive/compound-interest-calc";
import { BudgetAllocatorCalc } from "@/components/interactive/budget-allocator-calc";
import { SavingsGoalCalc } from "@/components/interactive/savings-goal-calc";
import { DebtPayoffCalc } from "@/components/interactive/debt-payoff-calc";
import { NeedsWantsSorter } from "@/components/interactive/needs-wants-sorter";
import { Scenario as ScenarioBlock } from "@/components/interactive/scenario";
import { Icon } from "@/components/ui/icons";

const CONCEPT_GRAPHIC: Record<string, React.ReactElement> = {
  compound: <Icon.CompoundInterest className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />,
  needs: <Icon.Check className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />,
  wants: <Icon.Star className="h-5 w-5 shrink-0 text-[var(--color-secondary)]" />,
  exchange: <Icon.Investing className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />,
  store: <Icon.Bank className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />,
  need50: <Icon.Budget className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />,
  want30: <Icon.Goals className="h-5 w-5 shrink-0 text-[var(--color-secondary)]" />,
  save20: <Icon.Saving className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />,
  deposit: <Icon.Bank className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />,
  spread: <Icon.Lightning className="h-5 w-5 shrink-0 text-[var(--color-secondary)]" />,
};

export function ConceptCard({
  title,
  graphic,
  icon: _unusedIcon,
  children,
}: {
  title: string;
  graphic?: string;
  /** @deprecated Use `graphic` — emoji icons are no longer rendered */
  icon?: string;
  children: React.ReactNode;
}) {
  void _unusedIcon;
  const mark = graphic && graphic in CONCEPT_GRAPHIC ? CONCEPT_GRAPHIC[graphic] : null;
  return (
    <div className="my-8 rounded-r-xl border-l-4 border-[var(--color-primary)] bg-teal-50 py-4 pl-5 pr-5">
      <div className="flex items-start gap-2">
        {mark}
        <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[var(--color-primary)]">{title}</p>
      </div>
      <div className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-primary)]">{children}</div>
    </div>
  );
}

export function InteractiveCalculator({ type }: { type: string }) {
  if (type === "compound-interest") return <CompoundInterestCalc />;
  if (type === "budget-allocator") return <BudgetAllocatorCalc />;
  if (type === "savings-goal") return <SavingsGoalCalc />;
  if (type === "debt-payoff") return <DebtPayoffCalc />;
  if (type === "needs-vs-wants") return <NeedsWantsSorter />;
  return null;
}

export function Scenario(props: React.ComponentProps<typeof ScenarioBlock>) {
  return <ScenarioBlock {...props} />;
}

export function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 flex gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-sm">
        <Icon.Check className="h-5 w-5" />
      </span>
      <div className="text-[15px] font-semibold leading-relaxed text-[var(--color-text-primary)]">{children}</div>
    </div>
  );
}

export function RealWorldExample({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-r-xl border-l-4 border-[var(--color-secondary)] bg-amber-50 py-4 pl-5 pr-5">
      <p className="text-[13px] font-bold text-[var(--color-secondary)]">Real-world example</p>
      <div className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-primary)]">{children}</div>
    </div>
  );
}

export function FunFact({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4">
      <Icon.Lightning className="h-6 w-6 shrink-0 text-[var(--color-accent)]" />
      <div>
        <p className="text-[13px] font-bold text-[var(--color-accent)]">Fun fact</p>
        <div className="mt-1 text-[15px] leading-relaxed text-[var(--color-text-primary)]">{children}</div>
      </div>
    </div>
  );
}

export function Term({ define, children }: { define: string; children: React.ReactNode }) {
  return (
      <span className="group relative inline cursor-help border-b border-dotted border-[var(--color-primary)] font-medium text-[var(--color-primary)]">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-56 -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-normal leading-snug text-[var(--color-text-primary)] shadow-[var(--shadow-elevated)] group-hover:block group-focus-within:block">
        {define}
      </span>
    </span>
  );
}

export function h2({ children }: { children: React.ReactNode }) {
  const text = typeof children === "string" ? children : String((children as unknown[])?.[0] ?? "Section");
  return <h2 id={slugifyHeading(text)}>{children}</h2>;
}

export function h3({ children }: { children: React.ReactNode }) {
  const text = typeof children === "string" ? children : String((children as unknown[])?.[0] ?? "Section");
  return <h3 id={slugifyHeading(text)}>{children}</h3>;
}
