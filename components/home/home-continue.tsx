"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { useProgressStore } from "@/lib/store/progress-store";
import { topicMeta } from "@/lib/data/site";
import type { LessonMeta } from "@/types";

function topicIcon(topic: string) {
  if (topic === "budgeting") return Icon.Budget;
  if (topic === "saving") return Icon.Saving;
  if (topic === "investing") return Icon.Investing;
  if (topic === "debt" || topic === "credit") return Icon.Debt;
  if (topic === "banking") return Icon.Bank;
  if (topic === "goals") return Icon.Goals;
  if (topic === "tax") return Icon.Tax;
  return Icon.BookOpen;
}

function topicIconWrapClass(topic: string) {
  if (topic === "budgeting" || topic === "investing") return "bg-[var(--green-bg)] text-[var(--green-deeper)]";
  if (topic === "saving") return "bg-[var(--amber-bg)] text-[var(--amber-icon)]";
  if (topic === "debt" || topic === "credit") return "bg-[var(--pink-bg)] text-[var(--pink-icon)]";
  if (topic === "banking" || topic === "tax") return "bg-[var(--blue-bg)] text-[var(--blue-icon)]";
  return "bg-[var(--gray-100)] text-[var(--gray-500)]";
}

function ProgressDots({ status }: { status: "not_started" | "in_progress" | "completed" }) {
  return (
    <div className="progress-dots">
      {[0, 1, 2].map((i) => {
        let cls = "pdot";
        if (status === "completed") cls += " done";
        else if (status === "in_progress") {
          if (i === 0) cls += " done";
          else if (i === 1) cls += " active";
        }
        return <span key={i} className={cls} />;
      })}
    </div>
  );
}

export function HomeContinue({ lessons, isLoggedIn }: { lessons: LessonMeta[]; isLoggedIn: boolean }) {
  const guest = useProgressStore((s) => s.guestProgress);
  const preview = lessons.slice(0, 4);

  return (
    <section className="mx-auto mt-16 max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="sec-header">
        <h2 className="text-base font-extrabold text-[var(--black)]">{isLoggedIn ? "Continue learning" : "Start learning"}</h2>
        <Link href="/learn" className="sec-link">
          View all →
        </Link>
      </div>
      <div className="grid gap-3">
        {preview.map((l) => {
          const st = guest[l.slug]?.status ?? "not_started";
          const I = topicIcon(l.topic);
          return (
            <Link
              key={l.slug}
              href={`/learn/${l.slug}`}
              className="flex items-center gap-3 rounded-[14px] border-[1.5px] border-[var(--border)] bg-[var(--white)] px-[14px] py-[13px] transition-all duration-200 hover:border-[var(--green)] hover:bg-[var(--green-bg)]"
            >
              <div
                className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] ${topicIconWrapClass(l.topic)}`}
              >
                <I className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold tracking-tight text-[var(--black)]">{l.title}</p>
                <p className="mt-0.5 text-[12px] font-medium text-[var(--gray-400)]">
                  {topicMeta[l.topic]?.label ?? l.topic} · {l.estimatedMinutes} min
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <ProgressDots status={st} />
                <span className="pill-xp">+{l.xpReward ?? 10} XP</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
