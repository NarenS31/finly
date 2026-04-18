"use client";

import { slugifyHeading } from "@/lib/utils/content";
import { CompoundInterestCalc } from "@/components/interactive/compound-interest-calc";
import { BudgetAllocatorCalc } from "@/components/interactive/budget-allocator-calc";
import { SavingsGoalCalc } from "@/components/interactive/savings-goal-calc";
import { DebtPayoffCalc } from "@/components/interactive/debt-payoff-calc";
import { NeedsWantsSorter } from "@/components/interactive/needs-wants-sorter";
import { Scenario as ScenarioBlock } from "@/components/interactive/scenario";

export function ConceptCard({ title, icon, children }: { title: string; icon?: string; children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-r-2xl border-l-4 border-[var(--color-primary)] bg-[var(--color-primary-light)] p-5">
      <p className="font-semibold text-[var(--color-text-primary)]">
        {icon ? `${icon} ` : ""}
        {title}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{children}</div>
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
    <div className="my-6 rounded-2xl border border-[var(--color-success)] bg-[var(--color-success-light)] p-5">
      <p className="font-semibold text-[var(--color-success)]">Key takeaway</p>
      <div className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">{children}</div>
    </div>
  );
}

export function RealWorldExample({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-2xl border border-[var(--color-accent)] bg-[var(--color-accent-light)] p-5">
      <p className="font-semibold text-[var(--color-accent)]">Real-world example</p>
      <div className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">{children}</div>
    </div>
  );
}

export function FunFact({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary-light)] p-5">
      <p className="font-semibold text-[var(--color-primary-dark)]">Fun fact</p>
      <div className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">{children}</div>
    </div>
  );
}

export function Term({ define, children }: { define: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline cursor-help border-b border-dotted border-[var(--color-primary)] font-medium text-[var(--color-primary-dark)]">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-56 -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-normal leading-snug text-[var(--color-text-secondary)] shadow-[var(--shadow-lg)] group-hover:block group-focus-within:block">
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
