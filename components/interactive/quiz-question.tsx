"use client";

import { useState } from "react";
import { useProgress } from "@/lib/hooks/use-progress";

export function QuizQuestion({
  lessonSlug,
  question,
  options,
  correct,
  explanation,
  index = 0,
}: {
  lessonSlug: string;
  question: string;
  options?: string[];
  correct: number;
  explanation: string;
  index?: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const { setLessonProgress, entry } = useProgress(lessonSlug);
  const safeOptions = Array.isArray(options) ? options : [];

  const onAnswer = (answerIndex: number) => {
    setSelected(answerIndex);
    setLessonProgress({
      status: "in_progress",
      answeredQuestions: {
        ...(entry?.answeredQuestions ?? {}),
        [index]: answerIndex === correct,
      },
    });
  };

  return (
    <div className="my-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] md:p-5">
      <p className="font-semibold text-[var(--color-text-primary)]">{question}</p>
      <div className="mt-3 grid gap-2">
        {safeOptions.map((option, i) => {
          const isPicked = selected === i;
          const showCorrect = selected !== null && i === correct;
          const showWrong = selected !== null && isPicked && i !== correct;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onAnswer(i)}
              className={`min-h-11 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition md:min-h-12 ${
                showCorrect
                  ? "motion-safe:animate-[quizPulse_0.3s_ease-out] border-[var(--color-success)] bg-[var(--color-success-light)] text-[var(--color-text-primary)]"
                  : showWrong
                    ? "motion-safe:animate-[quizShake_0.4s_ease-out] border-[var(--color-error)] bg-[var(--color-error-light)] text-[var(--color-text-primary)]"
                    : isPicked
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-primary)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{explanation}</p>
      )}
    </div>
  );
}
