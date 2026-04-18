"use client";

import { useState } from "react";
import { curriculumSections } from "@/lib/data/site";

const topicAccents: Record<string, { gradient: string; glow: string; pill: string; dot: string }> = {
  Budgeting: {
    gradient: "from-violet-500/20 via-violet-400/10 to-transparent",
    glow: "shadow-violet-500/10",
    pill: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30",
    dot: "bg-violet-400",
  },
  Saving: {
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    glow: "shadow-emerald-500/10",
    pill: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30",
    dot: "bg-emerald-400",
  },
  Investing: {
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
    glow: "shadow-amber-500/10",
    pill: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30",
    dot: "bg-amber-400",
  },
  Banking: {
    gradient: "from-sky-500/20 via-sky-400/10 to-transparent",
    glow: "shadow-sky-500/10",
    pill: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30",
    dot: "bg-sky-400",
  },
};

const topicIcons: Record<string, string> = {
  Budgeting: "📊",
  Saving: "🏦",
  Investing: "📈",
  Banking: "💳",
};

export default function CurriculumPage() {
  const [open, setOpen] = useState<string | null>("Budgeting");

  return (
    <div className="space-y-5">
      {/* Hero header */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#0f1729] border border-white/[0.07] px-8 py-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-amber-500/8 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-teal-300 ring-1 ring-teal-400/25 uppercase">
            All topics
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Curriculum overview</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/55">
            Every topic is split by age tier so the language, examples, and decisions match what students are actually ready for.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {curriculumSections.map((s) => {
              const a = topicAccents[s.topic];
              return (
                <button
                  key={s.topic}
                  onClick={() => setOpen(s.topic)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${a?.pill ?? "bg-white/10 text-white/60"} ${open === s.topic ? "scale-105" : "opacity-70 hover:opacity-100"}`}
                >
                  <span>{topicIcons[s.topic]}</span>
                  {s.topic}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accordion sections */}
      <div className="space-y-3">
        {curriculumSections.map((item, idx) => {
          const isOpen = open === item.topic;
          const a = topicAccents[item.topic] ?? { gradient: "from-white/5 to-transparent", glow: "", pill: "bg-white/10 text-white/60 ring-1 ring-white/10", dot: "bg-white/40" };

          return (
            <div
              key={item.topic}
              className={`group relative overflow-hidden rounded-[20px] border transition-all duration-300 ${
                isOpen
                  ? "border-white/12 bg-[#0f1729] shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
                  : "border-white/[0.07] bg-[#0c1220]/80 hover:border-white/10 hover:bg-[#0f1729]/90"
              }`}
            >
              {/* Gradient wash */}
              <div className={`absolute inset-0 bg-gradient-to-r ${a.gradient} pointer-events-none transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />

              {/* Header button */}
              <button
                className="relative flex w-full items-center gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(isOpen ? null : item.topic)}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl backdrop-blur-sm ring-1 ring-white/[0.08]">
                  {topicIcons[item.topic] ?? "📚"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-white">{item.topic}</p>
                  {!isOpen && (
                    <p className="mt-0.5 truncate text-sm text-white/40">{item.summary}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${a.pill}`}>
                    {item.foundation.length + item.realWorld.length} lessons
                  </span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/50 ring-1 ring-white/[0.08] transition-transform duration-300 text-sm ${isOpen ? "rotate-180" : ""}`}>
                    ↓
                  </span>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="relative px-6 pb-6">
                  <p className="mb-5 text-sm leading-relaxed text-white/50 border-t border-white/[0.06] pt-4">{item.summary}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Foundation tier */}
                    <div className="rounded-[14px] bg-white/[0.04] p-4 ring-1 ring-white/[0.07]">
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${a.dot}`} />
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Ages 8–12</p>
                        <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/30">Foundation</span>
                      </div>
                      <ul className="space-y-2">
                        {item.foundation.map((l) => (
                          <li key={l} className="flex items-start gap-2 text-sm text-white/70">
                            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.dot} opacity-60`} />
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Real World tier */}
                    <div className="rounded-[14px] bg-white/[0.04] p-4 ring-1 ring-white/[0.07]">
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${a.dot}`} />
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Ages 13–17</p>
                        <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/30">Real World</span>
                      </div>
                      <ul className="space-y-2">
                        {item.realWorld.map((l) => (
                          <li key={l} className="flex items-start gap-2 text-sm text-white/70">
                            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.dot} opacity-60`} />
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
