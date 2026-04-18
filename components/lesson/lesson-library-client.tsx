"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LessonCard } from "@/components/lesson/lesson-card";
import { Finn } from "@/components/mascot/finn";
import { useAgeTierStore } from "@/lib/store/age-tier-store";
import { useProgressStore } from "@/lib/store/progress-store";
import { lessonMatchesTier } from "@/lib/utils/lesson-tier";
import type { LessonMeta } from "@/types";

const TOPIC_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "budgeting", label: "Budgeting" },
  { value: "saving", label: "Saving" },
  { value: "investing", label: "Investing" },
  { value: "debt", label: "Debt & Credit" },
  { value: "banking", label: "Banking" },
  { value: "goals", label: "Goals" },
  { value: "tax", label: "Tax" },
];

export function LessonLibraryClient({
  lessons,
  initialTopic = "all",
  isLoggedIn,
}: {
  lessons: LessonMeta[];
  initialTopic?: string;
  isLoggedIn: boolean;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState("all");
  const ageTier = useAgeTierStore((s) => s.ageTier);
  const guestProgress = useProgressStore((s) => s.guestProgress);

  const filtered = useMemo(() => {
    return lessons.filter((lesson) => {
      const tierOk = lessonMatchesTier(lesson, ageTier);
      const byTopic = topic === "all" || lesson.topic === topic;
      const byDifficulty = difficulty === "all" || lesson.difficulty === difficulty;
      const byQuery =
        lesson.title.toLowerCase().includes(query.toLowerCase()) ||
        lesson.description.toLowerCase().includes(query.toLowerCase());
      return tierOk && byTopic && byDifficulty && byQuery;
    });
  }, [lessons, ageTier, topic, difficulty, query]);

  const continueLessons = useMemo(
    () =>
      lessons.filter(
        (lesson) =>
          lessonMatchesTier(lesson, ageTier) && guestProgress[lesson.slug]?.status === "in_progress"
      ),
    [lessons, guestProgress, ageTier]
  );

  const completedGuestCount = useMemo(
    () => Object.values(guestProgress).filter((p) => p.status === "completed").length,
    [guestProgress]
  );

  const filtersActive = topic !== "all" || difficulty !== "all" || query.length > 0;

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <section className="surface-grid overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <Badge className="mb-4 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
              Lesson library
            </Badge>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-[var(--color-text-primary)] md:text-5xl">
              What do you want to learn?
            </h1>
            <p className="mt-3 max-w-2xl editorial-copy">
              Search lessons, filter by topic and difficulty, and learn at your pace. Your age tier shapes which lessons
              appear first.
            </p>
          </div>
          <Card className="border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Age tier</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Showing lessons for{" "}
              <strong>{ageTier === "8-12" ? "Foundation (8–12)" : "Real World (13–17)"}</strong>. Switch anytime from
              the nav.
            </p>
          </Card>
        </div>
        <div className="mt-6 flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2">
          <Icon.Search className="h-4 w-4 shrink-0 text-[var(--gray-400)]" aria-hidden />
          <Input
            placeholder="Search lessons…"
            className="min-h-11 border-0 bg-transparent px-0 py-2 shadow-none focus-visible:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      <div className="sticky top-[88px] z-30 -mx-4 border-y border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {TOPIC_FILTERS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTopic(t.value)}
              className={`min-h-9 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                topic === t.value
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[var(--shadow-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
              }`}
            >
              {t.label}
            </button>
          ))}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="min-h-9 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)]"
          >
            <option value="all">All difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {filtersActive && (
            <button
              type="button"
              onClick={() => {
                setTopic("all");
                setDifficulty("all");
                setQuery("");
              }}
              className="inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-[var(--color-primary)]"
            >
              <Icon.X className="h-4 w-4" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {continueLessons.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon.BookOpen className="h-5 w-5 text-[var(--green)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Continue where you left off</h2>
            </div>
            {!isLoggedIn && completedGuestCount > 0 && (
              <Button asChild variant="secondary" size="sm">
                <Link href="/auth/signup">Save your progress → Sign in</Link>
              </Button>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {continueLessons.map((lesson) => (
              <div key={lesson.slug} className="min-w-[280px] shrink-0">
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">All lessons</h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {filtered.length} lesson{filtered.length === 1 ? "" : "s"} match your filters.
            </p>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
          {ageTier === "8-12" ? (
            <Finn size={48} />
          ) : (
            <Icon.BookOpen className="h-12 w-12 text-[var(--gray-300)]" />
          )}
          <p className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
            No lessons found{query ? ` for “${query}”` : ""}
          </p>
          <p className="mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
            Try clearing filters or switching age tier — some lessons are built for a specific track.
          </p>
          <Button className="mt-6" type="button" onClick={() => setTopic("all")}>
            Reset topic filter
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
