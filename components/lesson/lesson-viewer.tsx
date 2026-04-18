"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { ProgressBar } from "@/components/lesson/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompletionCard } from "@/components/lesson/completion-card";
import { Finn } from "@/components/mascot/finn";
import { useProgress } from "@/lib/hooks/use-progress";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAgeTierStore } from "@/lib/store/age-tier-store";
import { useToastStore } from "@/lib/store/toast-store";
import type { HeadingItem } from "@/lib/utils/content";
import type { LessonMeta } from "@/types";

export function LessonViewer({
  slug,
  lessonId,
  title,
  topicLabel,
  ageTier,
  estimatedMinutes,
  headings,
  summary,
  nextLesson,
  relatedLessons,
  keyTakeaways,
  xpReward,
  quizCount: quizCountProp,
  children,
}: {
  slug: string;
  lessonId: string | null;
  title: string;
  topicLabel: string;
  ageTier: LessonMeta["ageTier"];
  estimatedMinutes: number;
  headings: HeadingItem[];
  summary: string;
  nextLesson?: LessonMeta;
  relatedLessons: LessonMeta[];
  keyTakeaways: string[];
  xpReward: number;
  quizCount: number | undefined;
  children: React.ReactNode;
}) {
  const effectiveQuizCount = typeof quizCountProp === "number" ? quizCountProp : 0;

  const [scrollPct, setScrollPct] = useState(0);
  const [activeHeading, setActiveHeading] = useState(headings[0]?.id ?? "");
  const { entry, setLessonProgress } = useProgress(slug);
  const { user } = useAuth();
  const showFinn = ageTier === "8-12" || ageTier === "both";
  const tier = useAgeTierStore((s) => s.ageTier);
  const toast = useToastStore((s) => s.show);
  const [celebrateOpen, setCelebrateOpen] = useState(false);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const fired = useRef(false);
  const lastStreakPing = useRef<number | undefined>(undefined);

  const answeredMap = useMemo(() => entry?.answeredQuestions ?? {}, [entry?.answeredQuestions]);
  const answeredAll = useMemo(() => {
    if (effectiveQuizCount <= 0) return true;
    for (let i = 0; i < effectiveQuizCount; i += 1) {
      if (!(i in answeredMap)) return false;
    }
    return true;
  }, [answeredMap, effectiveQuizCount]);

  const correctCount = useMemo(
    () => Object.entries(answeredMap).filter(([, ok]) => ok).length,
    [answeredMap]
  );

  const quizPercent =
    effectiveQuizCount > 0 ? Math.round((correctCount / effectiveQuizCount) * 100) : undefined;

  const xpEarned = useMemo(() => {
    let xp = xpReward;
    xp += correctCount;
    if (effectiveQuizCount > 0 && correctCount === effectiveQuizCount) xp += 5;
    return xp;
  }, [xpReward, correctCount, effectiveQuizCount]);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const percent = total > 0 ? (window.scrollY / total) * 100 : 0;
      setScrollPct(percent);
      setLessonProgress({ status: "in_progress", scrollProgress: percent });

      const visible = headings.findLast((heading) => {
        const element = document.getElementById(heading.id);
        if (!element) return false;
        return element.getBoundingClientRect().top <= 120;
      });
      if (visible) setActiveHeading(visible.id);

      if (user) {
        const now = Date.now();
        const last = lastStreakPing.current;
        if (last === undefined || now - last > 60000) {
          lastStreakPing.current = now;
          void fetch("/api/streak", { method: "POST" }).catch(() => {});
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings, setLessonProgress, user]);

  useEffect(() => {
    const scrollOk = scrollPct >= 90;
    const ready = scrollOk && answeredAll && entry?.status !== "completed";
    if (!ready || fired.current) return;
    fired.current = true;

    requestAnimationFrame(() => {
      const completedAt = new Date().toISOString();
      setLessonProgress({
        status: "completed",
        completedAt,
        quizScore: quizPercent,
      });

      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#5c6bc0", "#26a69a", "#ff7043", "#43a047", "#fb8c00", "#3949ab"],
      });
      setCelebrateKey((k) => k + 1);
      setCelebrateOpen(true);

      if (user && lessonId) {
        void (async () => {
          try {
            const res = await fetch("/api/lesson-complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lessonId,
                slug,
                scrollProgress: scrollPct,
                quizCorrect: correctCount,
                quizTotal: effectiveQuizCount,
              }),
            });
            const json = (await res.json()) as {
              error?: string;
              xpResult?: {
                xp_awarded?: number;
                new_level?: string;
                leveled_up?: boolean;
              };
              achievementResult?: { newly_earned?: { title: string; description: string | null }[] };
            };
            if (!res.ok) {
              console.error("[lesson-complete]", json.error ?? res.statusText);
              return;
            }
            const xp = json.xpResult;
            if (xp?.xp_awarded != null && xp.xp_awarded > 0) {
              toast(`+${xp.xp_awarded} XP earned`);
              if (xp.leveled_up) {
                setTimeout(() => {
                  toast(`🎉 You leveled up to ${xp.new_level}!`);
                }, 2000);
              }
            }
            const raw = json.achievementResult?.newly_earned;
            const achievements = Array.isArray(raw) ? raw : [];
            achievements.forEach((a, i) => {
              setTimeout(() => {
                toast(`🏆 Achievement unlocked: ${a.title}`);
              }, 3000 + i * 1500);
            });
          } catch (e) {
            console.error("[lesson-complete] fetch failed", e);
          }
        })();
      } else if (user && !lessonId) {
        console.warn("[FinPath] Lesson not linked to database (missing lessonId). Completion saved locally only.");
      }
    });
  }, [scrollPct, answeredAll, entry?.status, setLessonProgress, user, lessonId, slug, correctCount, effectiveQuizCount, quizPercent, toast]);

  const remaining = Math.max(1, Math.round(((100 - scrollPct) / 100) * estimatedMinutes));

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else await navigator.clipboard.writeText(url);
      toast("Link copied — share FinPath with a friend.");
    } catch {
      toast("Could not copy link.");
    }
  }, [title, toast]);

  const tierClass = tier === "8-12" ? "tier-foundation" : "";

  const quizLabel =
    effectiveQuizCount <= 0 ? "—" : `${correctCount}/${effectiveQuizCount}`;

  return (
    <div className="relative">
      <div className="fixed left-0 top-0 z-[45] h-1 w-full bg-[var(--color-border)]" aria-hidden>
        <div
          className="h-full bg-[var(--color-primary)] transition-[width] duration-700 ease-out"
          style={{ width: `${Math.min(100, scrollPct)}%` }}
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/learn"
          className="inline-flex min-h-11 items-center gap-2 font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>
      </div>

      <div className="grid gap-10 xl:grid-cols-[minmax(220px,260px)_minmax(0,1fr)]">
        <aside className="order-2 h-fit space-y-4 xl:sticky xl:top-24 xl:order-1">
          {showFinn && (
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Your guide</p>
              <div className="mt-3 flex justify-center">
                <Finn />
              </div>
            </Card>
          )}
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="font-semibold text-[var(--color-text-primary)]">On this page</p>
            <nav className="mt-3 grid gap-1" aria-label="Table of contents">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    activeHeading === heading.id
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)]"
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </Card>
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Progress</p>
            <ProgressBar value={scrollPct} />
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">Quiz: {quizLabel}</p>
          </Card>
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="font-semibold text-[var(--color-text-primary)]">Related lessons</p>
            <div className="mt-3 grid gap-2">
              {relatedLessons.length > 0 ? (
                relatedLessons.map((lesson) => (
                  <Link
                    key={lesson.slug}
                    href={`/learn/${lesson.slug}`}
                    className="rounded-xl bg-[var(--color-bg)] px-3 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)]"
                  >
                    {lesson.title}
                    <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
                      {lesson.estimatedMinutes} min
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">More lessons coming soon.</p>
              )}
            </div>
          </Card>
        </aside>

        <article className="order-1 min-w-0 xl:order-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{topicLabel}</Badge>
                <Badge variant="outline">{ageTier === "both" ? "All ages" : `Ages ${ageTier}`}</Badge>
              </div>
              <Button type="button" variant="ghost" className="btn-press" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" aria-hidden />
                Share
              </Button>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--color-text-primary)] md:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-3 editorial-copy">{summary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Card className="border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Reading</p>
                <p className="mt-2 text-xl font-bold">{Math.round(scrollPct)}%</p>
              </Card>
              <Card className="border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Time left</p>
                <p className="mt-2 text-xl font-bold">~{remaining} min</p>
              </Card>
              <Card className="border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Quiz score</p>
                <p className="mt-2 text-xl font-bold">{quizLabel}</p>
              </Card>
            </div>
          </motion.div>

          <div
            className={`rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:p-8 ${tierClass}`}
          >
            <div className="prose prose-zinc dark:prose-invert max-w-[720px] mx-auto prose-headings:text-[var(--color-text-primary)]">
              {children}
            </div>
          </div>

          {entry?.status === "completed" && !user && (
            <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
              Nice work!{" "}
              <Link href="/auth/signup" className="font-semibold text-[var(--color-primary)]">
                Sign up free
              </Link>{" "}
              to save your progress across devices.
            </p>
          )}
        </article>
      </div>

      <CompletionCard
        key={celebrateKey}
        open={celebrateOpen}
        takeaways={keyTakeaways}
        xp={xpEarned}
        nextLesson={nextLesson}
        onClose={() => setCelebrateOpen(false)}
      />
    </div>
  );
}
