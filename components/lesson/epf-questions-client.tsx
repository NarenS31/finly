"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/lesson/progress-bar";
import type { LessonQuizPrompt } from "@/types";

export function EpfQuestionsClient({
  slug,
  title,
  questions,
}: {
  slug: string;
  title: string;
  questions: LessonQuizPrompt[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<(number | string | null)[]>(() => questions.map(() => null));

  const current = questions[index];
  const total = questions.length;
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;
  const currentResponse = responses[index];
  const canContinue =
    typeof currentResponse === "number" || (typeof currentResponse === "string" && currentResponse.trim().length > 0);
  const isDone = total > 0 && index >= total;

  const responseSummary = useMemo(
    () =>
      questions.map((question, questionIndex) => {
        const answer = responses[questionIndex];
        if (question.type === "multiple_choice") {
          return typeof answer === "number" ? question.options[answer] ?? "No response" : "No response";
        }
        return typeof answer === "string" && answer.trim() ? answer.trim() : "No response";
      }),
    [questions, responses]
  );

  if (total === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <p className="text-lg font-semibold text-[var(--color-text-primary)]">This module does not have a separate question set yet.</p>
        <Button asChild className="mt-6">
          <Link href={`/epf-curriculum/${slug}`}>Back to module</Link>
        </Button>
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="mx-auto min-h-[70vh] max-w-3xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-lg)]"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">Question set complete</p>
          <h1 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">{title}</h1>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            These NC teacher-guide questions are discussion and reflection prompts, so this page tracks completion instead of auto-grading.
          </p>

          <div className="mt-8 grid gap-4">
            {questions.map((question, questionIndex) => (
              <Card key={`${question.prompt}-${questionIndex}`} className="border-[var(--color-border)] bg-[var(--color-bg)] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  {question.type === "multiple_choice" ? "Multiple choice" : "Short answer"}
                </p>
                <p className="mt-2 font-semibold text-[var(--color-text-primary)]">{question.prompt}</p>
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{responseSummary[questionIndex]}</p>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIndex(0);
                setResponses(questions.map(() => null));
              }}
            >
              Restart questions
            </Button>
            <Button variant="secondary" asChild>
              <Link href={`/epf-curriculum/${slug}`}>Back to module</Link>
            </Button>
            <Button asChild>
              <Link href="/curriculum">Back to curriculum</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[720px] flex-col px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push(`/epf-curriculum/${slug}`)}
          className="min-h-11 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          ← Module
        </button>
        <span className="text-xs font-medium text-[var(--color-text-muted)]">{title}</span>
      </div>

      <ProgressBar value={progress} />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="mt-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)]"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {current.type === "multiple_choice" ? "Multiple choice" : "Short answer"}
          </p>
          <p className="mt-2 text-xs font-medium text-[var(--color-text-muted)]">
            Question {index + 1} of {total}
          </p>
          <h2 className="mt-3 text-xl font-bold text-[var(--color-text-primary)]">{current.prompt}</h2>

          {current.type === "multiple_choice" ? (
            <div className="mt-5 grid gap-3">
              {current.options.map((option, optionIndex) => {
                const selected = currentResponse === optionIndex;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setResponses((existing) => {
                        const next = [...existing];
                        next[index] = optionIndex;
                        return next;
                      });
                    }}
                    className={`min-h-[48px] rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      selected
                        ? "border-teal-400 bg-teal-100 text-teal-900"
                        : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-5">
              <textarea
                value={typeof currentResponse === "string" ? currentResponse : ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setResponses((existing) => {
                    const next = [...existing];
                    next[index] = value;
                    return next;
                  });
                }}
                placeholder={current.placeholder ?? "Write your response here..."}
                className="min-h-[180px] w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-teal-400"
              />
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                {current.guidance ?? "These prompts are designed for reflection and teacher discussion, so your response is saved for review rather than auto-graded."}
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={index === 0}
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              disabled={!canContinue}
              onClick={() => setIndex((value) => value + 1)}
            >
              {index + 1 === total ? "Finish" : "Next"}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
