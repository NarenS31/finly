"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "@/components/lesson/progress-bar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { useAuth } from "@/lib/hooks/use-auth";
import type { ExtractedQuizQuestion } from "@/lib/utils/extract-quiz-from-mdx";

function starCount(pct: number) {
  if (pct >= 100) return 3;
  if (pct >= 50) return 2;
  return 1;
}

function useCountUp(target: number, active: boolean, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - (1 - t) ** 3;
      setV(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, ms]);
  return v;
}

export function LessonQuizClient({
  slug,
  title,
  lessonId,
  xpReward,
  questions,
  nextLessonSlug,
}: {
  slug: string;
  title: string;
  lessonId: string | null;
  xpReward: number;
  questions: ExtractedQuizQuestion[];
  nextLessonSlug: string | null;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [phase, setPhase] = useState<"quiz" | "done">("quiz");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<{ selected: number; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);

  const q = questions[index];
  const total = questions.length;

  const score = useMemo(
    () => answers.reduce((acc, a) => acc + (a.correct ? 1 : 0), 0),
    [answers]
  );

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const displayScore = useCountUp(score, phase === "done");

  const xpPreview = useMemo(() => {
    let xp = xpReward;
    xp += score;
    if (total > 0 && score === total) xp += 5;
    return xp;
  }, [xpReward, score, total]);

  useEffect(() => {
    if (phase !== "done" || !user || !lessonId || total === 0) return;
    void (async () => {
      await fetch("/api/quiz-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          slug,
          correct: score,
          total,
        }),
      }).catch(() => {});
    })();
  }, [phase, user, lessonId, slug, score, total]);

  const goNext = useCallback(() => {
    if (selected === null || !q) return;
    const ok = selected === q.correct;
    setFlash(ok ? "ok" : "bad");
    setRevealed(true);
  }, [q, selected]);

  const advance = useCallback(() => {
    if (!q || selected === null) return;
    const ok = selected === q.correct;
    setAnswers((a) => [...a, { selected, correct: ok }]);
    setSelected(null);
    setRevealed(false);
    setFlash(null);
    if (index + 1 >= total) {
      setPhase("done");
      return;
    }
    setDirection(1);
    setIndex((i) => i + 1);
  }, [q, selected, index, total]);

  if (total === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <p className="text-lg font-semibold text-[var(--color-text-primary)]">No quiz questions in this lesson yet.</p>
        <Button asChild className="mt-6">
          <Link href={`/learn/${slug}`}>Back to lesson</Link>
        </Button>
      </div>
    );
  }

  if (phase === "done") {
    const stars = starCount(pct);
    return (
      <div className="mx-auto min-h-[70vh] max-w-xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-lg)]"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">Quiz complete</p>
          <h1 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">{title}</h1>
          <p className="mt-6 text-5xl font-extrabold tabular-nums text-[var(--color-text-primary)]">
            {displayScore} / {total}
          </p>
            <div className="mt-4 flex justify-center gap-1">
              {[1, 2, 3].map((s) => (
                <Icon.StarFilled
                  key={s}
                  className={`h-10 w-10 ${s <= stars ? "text-[#fbbf24]" : "text-[var(--gray-200)]"}`}
                />
              ))}
            </div>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            If this were your first lesson completion, you would earn about <strong>{xpPreview} XP</strong> (includes quiz bonuses).
          </p>
          <ul className="mt-8 space-y-4 text-left text-sm">
            {questions.map((qq, i) => {
              const a = answers[i];
              const wrong = a && !a.correct;
              return (
                <li key={i} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                  <p className="font-medium text-[var(--color-text-primary)]">{qq.question}</p>
                  <p className="mt-1 text-[var(--color-text-muted)]">
                    Your answer: {qq.options[a?.selected ?? 0] ?? "—"}
                  </p>
                  <p className="text-[var(--color-text-secondary)]">Correct: {qq.options[qq.correct]}</p>
                  {wrong && qq.explanation ? (
                    <p className="mt-2 text-[var(--color-text-secondary)]">{qq.explanation}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                setPhase("quiz");
                setIndex(0);
                setAnswers([]);
                setSelected(null);
                setRevealed(false);
              }}
            >
              Retake quiz
            </Button>
            <Button variant="secondary" asChild>
              <Link href={`/learn/${slug}`}>Back to lesson</Link>
            </Button>
            {nextLessonSlug ? (
              <Button asChild>
                <Link href={`/learn/${nextLessonSlug}`}>Next lesson →</Link>
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/learn">Lesson library</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const progressPct = ((index + (revealed ? 1 : 0)) / total) * 100;

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[600px] flex-col px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push(`/learn/${slug}`)}
          className="min-h-11 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          ← Lesson
        </button>
        <span className="text-xs font-medium text-[var(--color-text-muted)]">{title}</span>
      </div>
      <ProgressBar value={progressPct} />
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={`mt-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)] ${
            flash === "ok" ? "motion-safe:animate-[quizPulse_0.3s_ease-out]" : ""
          } ${flash === "bad" ? "motion-safe:animate-[quizShake_0.4s_ease-out]" : ""}`}
        >
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Question {index + 1} of {total}
          </p>
          <h2 className="mt-3 text-xl font-bold text-[var(--color-text-primary)]">{q.question}</h2>
          <div className="mt-5 grid gap-3">
            {q.options.map((option, i) => {
              const isSel = selected === i;
              const showResult = revealed;
              const isCorrect = i === q.correct;
              const tone =
                showResult && isSel
                  ? isCorrect
                    ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                    : "border-red-400 bg-red-100 text-red-900"
                  : isSel
                    ? "border-teal-400 bg-teal-100 text-teal-900"
                    : "border-[var(--color-border)] bg-[var(--color-bg)]";
              return (
                <button
                  key={i}
                  type="button"
                  disabled={revealed}
                  onClick={() => setSelected(i)}
                  className={`min-h-[48px] rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${tone}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {revealed && q.explanation ? (
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">{q.explanation}</p>
          ) : null}
          <div className="mt-6">
            {!revealed ? (
              <Button className="min-h-12 w-full sm:w-auto" disabled={selected === null} onClick={goNext}>
                Check answer
              </Button>
            ) : (
              <Button className="min-h-12 w-full sm:w-auto" onClick={advance}>
                Next question →
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
