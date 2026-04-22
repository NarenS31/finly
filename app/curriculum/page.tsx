"use client";

import { useState } from "react";
import { curriculumSections } from "@/lib/data/site";
import { Icon } from "@/components/ui/icons";
import type { ReactNode } from "react";

type TopicAccent = {
  icon: ReactNode;
  dot: string;
  badge: string;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  cardBorder: string;
  tierBg: string;
  accentBar: string;
};

const topicAccents: Record<string, TopicAccent> = {
  Budgeting: {
    icon: <Icon.Budget className="h-5 w-5" />,
    dot: "bg-violet-400",
    badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    cardBg: "bg-violet-50/40",
    cardBorder: "border-violet-200",
    tierBg: "bg-violet-50/60",
    accentBar: "border-l-4 border-l-violet-300",
  },
  Saving: {
    icon: <Icon.Saving className="h-5 w-5" />,
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    cardBg: "bg-emerald-50/40",
    cardBorder: "border-emerald-200",
    tierBg: "bg-emerald-50/60",
    accentBar: "border-l-4 border-l-emerald-300",
  },
  Investing: {
    icon: <Icon.Investing className="h-5 w-5" />,
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    cardBg: "bg-amber-50/40",
    cardBorder: "border-amber-200",
    tierBg: "bg-amber-50/60",
    accentBar: "border-l-4 border-l-amber-300",
  },
  Banking: {
    icon: <Icon.Bank className="h-5 w-5" />,
    dot: "bg-sky-400",
    badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    cardBg: "bg-sky-50/40",
    cardBorder: "border-sky-200",
    tierBg: "bg-sky-50/60",
    accentBar: "border-l-4 border-l-sky-300",
  },
};

export default function CurriculumPage() {
  const [open, setOpen] = useState<string | null>("Budgeting");

  // Import curriculum map data (static import for now)
  const ncCurriculum = [
    { code: 'E.1.1', title: 'Types of Economies', file: 'E.1.1.md' },
    { code: 'E.1.2', title: 'Market Structures', file: 'E.1.2.md' },
    { code: 'E.1.3', title: 'Supply & Demand', file: 'E.1.3.md' },
    { code: 'E.1.4', title: 'Incentives & Profits', file: 'E.1.4.md' },
    { code: 'E.2.1', title: 'Macroeconomic Indicators', file: 'E.2.1.md' },
    { code: 'E.2.2', title: 'Microeconomic Indicators', file: 'E.2.2.md' },
    { code: 'E.2.3', title: 'Fiscal & Monetary Policy', file: 'E.2.3.md' },
    { code: 'E.2.4', title: 'Economic Organizations', file: 'E.2.4.md' },
    { code: 'E.3.1', title: 'Legal Structure & Property Rights', file: 'E.3.1.md' },
    { code: 'E.3.2', title: 'Regulation', file: 'E.3.2.md' },
    { code: 'E.3.3', title: 'Taxes & Government Services', file: 'E.3.3.md' },
    { code: 'E.4.1', title: 'Trade & Interdependence', file: 'E.4.1.md' },
    { code: 'E.4.2', title: 'NC in US/World Economy', file: 'E.4.2.md' },
    { code: 'IE.1.1', title: 'Education, Income, Career, Lifestyle', file: 'IE.1.1.md' },
    { code: 'IE.1.2', title: 'Career/Education Options', file: 'IE.1.2.md' },
    { code: 'IE.1.3', title: 'Postsecondary Costs & Income', file: 'IE.1.3.md' },
    { code: 'IE.1.4', title: 'Minimizing Education Costs', file: 'IE.1.4.md' },
    { code: 'IE.1.5', title: 'Types of Income', file: 'IE.1.5.md' },
    { code: 'IE.2.1', title: 'Payroll Deductions', file: 'IE.2.1.md' },
    { code: 'IE.2.2', title: 'Types & Purposes of Taxes', file: 'IE.2.2.md' },
    { code: 'IE.2.3', title: 'Tax Form Preparation', file: 'IE.2.3.md' },
    { code: 'MCM.1.1', title: 'Creating a Spending Plan', file: 'MCM.1.1.md' },
    { code: 'MCM.1.2', title: 'Critiquing Plans', file: 'MCM.1.2.md' },
    { code: 'MCM.1.3', title: 'Renting, Leasing, Owning', file: 'MCM.1.3.md' },
    { code: 'MCM.1.4', title: 'Mortgages', file: 'MCM.1.4.md' },
    { code: 'MCM.2.1', title: 'Using Financial Services', file: 'MCM.2.1.md' },
    { code: 'MCM.2.2', title: 'Interest & Fees', file: 'MCM.2.2.md' },
    { code: 'MCM.2.3', title: 'Payment Methods', file: 'MCM.2.3.md' },
    { code: 'MCM.3.1', title: 'Credit Sources', file: 'MCM.3.1.md' },
    { code: 'MCM.3.2', title: 'Debt Management', file: 'MCM.3.2.md' },
    { code: 'MCM.3.3', title: 'Debt Pros/Cons', file: 'MCM.3.3.md' },
    { code: 'MCM.3.4', title: 'Insurance & Estate Planning', file: 'MCM.3.4.md' },
    { code: 'FP.1.1', title: 'Investing Strategies', file: 'FP.1.1.md' },
    { code: 'FP.1.2', title: 'Factors in Financial Planning', file: 'FP.1.2.md' },
    { code: 'FP.1.3', title: 'Philanthropy & Community', file: 'FP.1.3.md' },
    { code: 'CC.1.1', title: 'Advertising & Consumer Decisions', file: 'CC.1.1.md' },
    { code: 'CC.1.2', title: 'Information for Decisions', file: 'CC.1.2.md' },
    { code: 'CC.1.3', title: 'Consumer Impact on Economy', file: 'CC.1.3.md' },
    { code: 'CC.2.1', title: 'Consumer Protection Laws', file: 'CC.2.1.md' },
    { code: 'CC.2.2', title: 'Fraudulent Practices', file: 'CC.2.2.md' },
    { code: 'CC.2.3', title: 'Consumer Self-Protection', file: 'CC.2.3.md' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <section className="painted-surface surface-grid overflow-hidden rounded-3xl border border-[#e8dfcf] px-8 py-10 shadow-[var(--shadow-hero)]">
        <p className="label-eyebrow mb-3">All topics</p>
        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Curriculum overview</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
          Every topic is split by age tier so the language, examples, and decisions match what students are actually ready for.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {curriculumSections.map((s) => {
            const a = topicAccents[s.topic];
            return (
              <button
                key={s.topic}
                onClick={() => setOpen(s.topic)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${a?.badge ?? "bg-gray-100 text-gray-600"} ${open === s.topic ? "scale-105 shadow-sm" : "opacity-60 hover:opacity-100"}`}
              >
                <span className={a?.iconColor ?? "text-gray-600"}>{a?.icon}</span>
                {s.topic}
              </button>
            );
          })}
        </div>
      </section>

      {/* Accordion sections */}
      <div className="space-y-3">
        {curriculumSections.map((item) => {
          const isOpen = open === item.topic;
          const a = topicAccents[item.topic] ?? { icon: <Icon.Goals className="h-5 w-5" />, dot: "bg-gray-400", badge: "bg-gray-100 text-gray-600", iconBg: "bg-gray-50", iconColor: "text-gray-500", cardBg: "bg-gray-50", cardBorder: "border-gray-200", tierBg: "bg-gray-50", accentBar: "border-l-4 border-l-gray-300" };

          return (
            <div
              key={item.topic}
              className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? `${a.cardBorder} ${a.cardBg} ${a.accentBar} shadow-[var(--shadow-card)]`
                  : `border-[#e8dfcf] bg-white/70 hover:${a.cardBg} hover:${a.cardBorder} hover:shadow-[var(--shadow-card)]`
              }`}
            >
              {/* Header button */}
              <button
                className="flex w-full items-center gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(isOpen ? null : item.topic)}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-[var(--color-border)] ${a.iconBg} ${a.iconColor}`}>
                  {a.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">{item.topic}</p>
                  {!isOpen && (
                    <p className="mt-0.5 truncate text-sm text-[var(--color-text-secondary)]">{item.summary}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${a.badge}`}>
                    {item.foundation.length + item.realWorld.length} lessons
                  </span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 text-sm transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                    ↓
                  </span>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-6 pb-6">
                  <p className="mb-5 border-t border-[var(--color-border)] pt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{item.summary}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Foundation tier */}
                    <div className={`rounded-xl p-4 ring-1 ring-[var(--color-border)] ${a.tierBg}`}>
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${a.dot}`} />
                        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">Ages 8–12</p>
                        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-gray-200">Foundation</span>
                      </div>
                      <ul className="space-y-2">
                        {item.foundation.map((l) => (
                          <li key={l} className="flex items-start gap-2 text-sm text-[var(--color-text-primary)]">
                            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.dot} opacity-70`} />
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Real World tier */}
                    <div className={`rounded-xl p-4 ring-1 ring-[var(--color-border)] ${a.tierBg}`}>
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${a.dot}`} />
                        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">Ages 13–17</p>
                        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-gray-200">Real World</span>
                      </div>
                      <ul className="space-y-2">
                        {item.realWorld.map((l) => (
                          <li key={l} className="flex items-start gap-2 text-sm text-[var(--color-text-primary)]">
                            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.dot} opacity-70`} />
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* NC Curriculum Section */}
      <section className="painted-surface surface-grid overflow-hidden rounded-3xl border border-[#e8dfcf] px-8 py-10 shadow-[var(--shadow-hero)]">
        <p className="label-eyebrow mb-3">North Carolina</p>
        <h2 className="text-3xl font-extrabold leading-tight md:text-4xl mb-2">NC Curriculum Lessons</h2>
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
          These lessons are fully aligned to the North Carolina Economics & Personal Finance (EPF) standards. Each module includes teacher notes, activities, and assessments. Click a lesson to view the teacher guide.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full border text-sm bg-white rounded-xl">
            <thead>
              <tr className="bg-[#f7f5ef] text-[var(--color-text-secondary)]">
                <th className="px-3 py-2 text-left font-semibold">Code</th>
                <th className="px-3 py-2 text-left font-semibold">Title</th>
                <th className="px-3 py-2 text-left font-semibold">Teacher Module</th>
              </tr>
            </thead>
            <tbody>
              {ncCurriculum.map((mod) => {
                const slug = mod.file.replace(/\.md$/, "");
                return (
                  <tr key={mod.code} className="border-t last:border-b">
                    <td className="px-3 py-2 font-mono text-xs text-[var(--color-primary)]">{mod.code}</td>
                    <td className="px-3 py-2">{mod.title}</td>
                    <td className="px-3 py-2">
                      <a
                        href={`/epf-curriculum/${slug}`}
                        className="text-[var(--color-primary)] underline hover:text-[var(--color-text-primary)]"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
