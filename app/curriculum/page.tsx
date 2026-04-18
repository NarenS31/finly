"use client";

import { useState } from "react";
import { curriculumSections } from "@/lib/data/site";

export default function CurriculumPage() {
  const [open, setOpen] = useState<string | null>("Budgeting");

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/60 bg-white/75 p-8 shadow-[var(--shadow-card)] backdrop-blur">
        <h1 className="text-5xl font-extrabold">Curriculum overview</h1>
        <p className="mt-3 max-w-3xl editorial-copy">Every topic is split by age tier so the language, examples, and decisions match what students are actually ready for.</p>
      </section>
      {curriculumSections.map((item) => (
        <div key={item.topic} className="rounded-[24px] border border-white/60 bg-white/80 p-5 shadow-[var(--shadow-card)]">
          <button className="w-full text-left text-xl font-bold" onClick={() => setOpen(open === item.topic ? null : item.topic)}>
            {item.topic}
          </button>
          {open === item.topic && (
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <p className="md:col-span-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.summary}</p>
              <div>
                <p className="font-semibold">Ages 8-12</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-[var(--color-text-secondary)]">
                  {item.foundation.map((l) => <li key={l}>{l}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Ages 13-17</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-[var(--color-text-secondary)]">
                  {item.realWorld.map((l) => <li key={l}>{l}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
