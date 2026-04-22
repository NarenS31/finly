"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressBar } from "@/components/lesson/progress-bar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { useAuth } from "@/lib/hooks/use-auth";
import { countGradablePrompts } from "@/lib/utils/quiz-prompts";
import type { LessonQuizPrompt } from "@/types";

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

type PromptResponse = {
  selected?: number;
  text?: string;
  correct?: boolean;
};

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
  questions: LessonQuizPrompt[];
  nextLessonSlug: string | null;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [phase, setPhase] = useState<"quiz" | "done">("quiz");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [responses, setResponses] = useState<PromptResponse[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [textResponse, setTextResponse] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);

  const q = questions[index];
  const total = questions.length;
  const gradableTotal = countGradablePrompts(questions);
  const score = useMemo(
    () => responses.reduce((acc, response) => acc + (response.correct ? 1 : 0), 0),
    [responses]
  );

  const pct = gradableTotal > 0 ? Math.round((score / gradableTotal) * 100) : 100;
  const displayScore = useCountUp(score, phase === "done");

  const xpPreview = useMemo(() => {
    let xp = xpReward;
    xp += score;
    if (gradableTotal > 0 && score === gradableTotal) xp += 5;
    return xp;
  }, [xpReward, score, gradableTotal]);

  useEffect(() => {
    if (phase !== "done" || !user || !lessonId || gradableTotal === 0) return;
    void (async () => {
      await fetch("/api/quiz-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          slug,
          correct: score,
          total: gradableTotal,
        }),
      }).catch(() => {});
    })();
  }, [phase, user, lessonId, slug, score, gradableTotal]);

  const canContinue =
    q?.type === "multiple_choice" ? selected !== null : textResponse.trim().length > 0;

  const revealAnswer = () => {
    if (!q || q.type !== "multiple_choice" || selected === null) return;
    const ok = selected === q.correct;
    setFlash(ok ? "ok" : "bad");
    setRevealed(true);
  };

  const advance = () => {
    if (!q) return;

    const nextResponses = [...responses];
    if (q.type === "multiple_choice") {
      if (selected === null) return;
      nextResponses.push({ selected, correct: selected === q.correct });
    } else {
      if (!textResponse.trim()) return;
      nextResponses.push({ text: textResponse.trim() });
    }

    setResponses(nextResponses);
    setSelected(null);
    setTextResponse("");
    setRevealed(false);
    setFlash(null);

    if (index + 1 >= total) {
      setPhase("done");
      return;
    }

    setDirection(1);
    setIndex((value) => value + 1);
  };

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
            {displayScore} / {gradableTotal || total}
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
            {gradableTotal > 0
              ? `You answered ${score} of ${gradableTotal} auto-graded questions correctly and completed ${total} prompts total.`
              : `You completed all ${total} prompts in this lesson review.`}
          </p>
          {gradableTotal > 0 ? (
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              If this were your first lesson completion, you would earn about <strong>{xpPreview} XP</strong> (includes quiz bonuses).
            </p>
          ) : null}

          <ul className="mt-8 space-y-4 text-left text-sm">
            {questions.map((prompt, promptIndex) => {
              const response = responses[promptIndex];
              const wrong = response?.correct === false;
              return (
                <li key={promptIndex} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                  <p className="font-medium text-[var(--color-text-primary)]">{prompt.prompt}</p>
                  {prompt.type === "multiple_choice" ? (
                    <>
                      <p className="mt-1 text-[var(--color-text-muted)]">
                        Your answer: {typeof response?.selected === "number" ? prompt.options[response.selected] : "—"}
                      </p>
                      <p className="text-[var(--color-text-secondary)]">Correct: {prompt.options[prompt.correct]}</p>
                      {wrong && prompt.explanation ? (
                        <p className="mt-2 text-[var(--color-text-secondary)]">{prompt.explanation}</p>
                      ) : null}
                    </>
                  ) : (
                    <p className="mt-2 text-[var(--color-text-secondary)]">{response?.text ?? "No response"}</p>
                  )}
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
                setResponses([]);
                setSelected(null);
                setTextResponse("");
                setRevealed(false);
                setFlash(null);
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

  const progressPct = ((index + (revealed || q?.type === "short_answer" ? 1 : 0)) / total) * 100;

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
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {q.type === "multiple_choice" ? "Multiple choice" : "Short answer"}
          </p>
          <h2 className="mt-3 text-xl font-bold text-[var(--color-text-primary)]">{q.prompt}</h2>

          {q.type === "multiple_choice" ? (
            <>
              <div className="mt-5 grid gap-3">
                {q.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const showResult = revealed;
                  const isCorrect = optionIndex === q.correct;
                  const tone =
                    showResult && isSelected
                      ? isCorrect
                        ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                        : "border-red-400 bg-red-100 text-red-900"
                      : isSelected
                        ? "border-teal-400 bg-teal-100 text-teal-900"
                        : "border-[var(--color-border)] bg-[var(--color-bg)]";

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={revealed}
                      onClick={() => setSelected(optionIndex)}
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
                  <Button className="min-h-12 w-full sm:w-auto" disabled={!canContinue} onClick={revealAnswer}>
                    Check answer
                  </Button>
                ) : (
                  <Button className="min-h-12 w-full sm:w-auto" onClick={advance}>
                    {index + 1 === total ? "Finish quiz" : "Next question →"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mt-5">
                <textarea
                  value={textResponse}
                  onChange={(event) => setTextResponse(event.target.value)}
                  placeholder={q.placeholder ?? "Write your response here..."}
                  className="min-h-[180px] w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-teal-400"
                />
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                  {q.guidance ?? "Use specific details from the lesson in your response."}
                </p>
              </div>
              <div className="mt-6">
                <Button className="min-h-12 w-full sm:w-auto" disabled={!canContinue} onClick={advance}>
                  {index + 1 === total ? "Finish quiz" : "Save and continue →"}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
