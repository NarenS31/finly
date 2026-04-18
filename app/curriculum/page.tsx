"use client";

import { useState } from "react";
import { curriculumSections } from "@/lib/data/site";

const topicAccents: Record<string, { icon: string; dot: string; badge: string }> = {
  Budgeting: { icon: "📊", dot: "bg-violet-400", badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" },
  Saving:    { icon: "🏦", dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  Investing: { icon: "📈", dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  Banking:   { icon: "💳", dot: "bg-sky-400",     badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200" },
};

export default function CurriculumPage() {
  const [open, setOpen] = useState<string | null>("Budgeting");

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
                <span>{a?.icon}</span>
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
          const a = topicAccents[item.topic] ?? { icon: "📚", dot: "bg-gray-400", badge: "bg-gray-100 text-gray-600" };

          return (
            <div
              key={item.topic}
              className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? "border-[#e8dfcf] bg-white shadow-[var(--shadow-card)]"
                  : "border-[#e8dfcf] bg-white/70 hover:bg-white hover:shadow-[var(--shadow-card)]"
              }`}
            >
              {/* Header button */}
              <button
                className="flex w-full items-center gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(isOpen ? null : item.topic)}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl ring-1 ring-[var(--color-border)]">
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
                    <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-[var(--color-border)]">
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
                    <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-[var(--color-border)]">
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
    </div>
  );
}
