"use client";

import { useState } from "react";
import Link from "next/link";
import { topicMeta } from "@/lib/data/site";

export type HistoryRow = {
  id: string;
  quiz_score: number | null;
  quiz_correct: number | null;
  quiz_total: number | null;
  time_spent_seconds: number | null;
  completed_at: string | null;
  lessons: { title: string; topic: string; slug: string } | null;
};

function formatTime(sec: number | null) {
  if (sec == null || sec <= 0) return "—";
  const m = Math.round(sec / 60);
  return `${m} min`;
}

function formatQuiz(r: HistoryRow) {
  if (r.quiz_correct != null && r.quiz_total != null && r.quiz_total > 0) {
    return `${r.quiz_correct}/${r.quiz_total}`;
  }
  if (r.quiz_score != null) return `${r.quiz_score}%`;
  return "—";
}

export function LessonHistory({ rows }: { rows: HistoryRow[] }) {
  const [show, setShow] = useState(10);
  const slice = rows.slice(0, show);

  return (
    <div className="space-y-4">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
            <tr>
              <th className="pb-3 pr-4 font-medium">Lesson</th>
              <th className="pb-3 pr-4 font-medium">Topic</th>
              <th className="pb-3 pr-4 font-medium">Completed</th>
              <th className="pb-3 pr-4 font-medium">Quiz</th>
              <th className="pb-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id} className="border-b border-[var(--color-border)]">
                <td className="py-3 pr-4 font-medium text-[var(--color-text-primary)]">
                  <Link href={`/learn/${r.lessons?.slug ?? "#"}`} className="hover:text-[var(--color-primary)]">
                    {r.lessons?.title ?? "—"}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-[var(--color-text-secondary)]">
                  {r.lessons?.topic ? topicMeta[r.lessons.topic]?.label ?? r.lessons.topic : "—"}
                </td>
                <td className="py-3 pr-4 text-[var(--color-text-secondary)]">
                  {r.completed_at ? new Date(r.completed_at).toLocaleDateString() : "—"}
                </td>
                <td className="py-3 pr-4">{formatQuiz(r)}</td>
                <td className="py-3 text-[var(--color-text-secondary)]">{formatTime(r.time_spent_seconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {slice.map((r) => (
          <div key={r.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <Link href={`/learn/${r.lessons?.slug ?? "#"}`} className="font-semibold text-[var(--color-text-primary)]">
              {r.lessons?.title ?? "—"}
            </Link>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {r.lessons?.topic ? topicMeta[r.lessons.topic]?.label ?? r.lessons.topic : "—"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
              <span>{r.completed_at ? new Date(r.completed_at).toLocaleDateString() : "—"}</span>
              <span>Quiz: {formatQuiz(r)}</span>
              <span>{formatTime(r.time_spent_seconds)}</span>
            </div>
          </div>
        ))}
      </div>
      {rows.length > show && (
        <button
          type="button"
          className="text-sm font-semibold text-[var(--color-primary)]"
          onClick={() => setShow((s) => s + 10)}
        >
          Show more
        </button>
      )}
    </div>
  );
}
