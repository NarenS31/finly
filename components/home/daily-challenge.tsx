"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Finn } from "@/components/mascot/finn";
import { Button } from "@/components/ui/button";
import { XpFloat } from "@/components/ui/xp-float";
import { Icon } from "@/components/ui/icons";

interface Challenge {
  id: string;
  question: string;
  options: string[];
  xp_reward: number;
  /** Only present after answering */
  correct?: number;
  explanation?: string;
  completion?: { chosen: number; correct: boolean };
}

export function DailyChallenge({ isGuest = false }: { isGuest?: boolean }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; explanation: string; correctIdx: number } | null>(null);
  const [xpKey, setXpKey] = useState(0);
  const [xpAmount, setXpAmount] = useState(0);
  const submitted = useRef(false);

  useEffect(() => {
    fetch("/api/daily-challenge")
      .then((r) => r.json())
      .then((d: { challenge?: Challenge }) => {
        if (d.challenge) {
          setChallenge(d.challenge);
          // Already answered?
          if (d.challenge.completion) {
            setChosen(d.challenge.completion.chosen);
            setResult({
              correct: d.challenge.completion.correct,
              explanation: d.challenge.explanation ?? "",
              correctIdx: d.challenge.correct ?? -1,
            });
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const submit = async (idx: number) => {
    if (!challenge || submitted.current || result) return;
    submitted.current = true;
    setChosen(idx);

    const res = await fetch("/api/daily-challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId: challenge.id, chosen: idx }),
    });
    const data = (await res.json()) as {
      correct?: boolean;
      xp_awarded?: number;
      correct_idx?: number;
      explanation?: string;
    };

    // Re-fetch to get explanation + correct answer
    const full = await fetch("/api/daily-challenge").then((r) => r.json()) as { challenge?: Challenge };

    setResult({
      correct: data.correct ?? false,
      explanation: full.challenge?.explanation ?? "",
      correctIdx: full.challenge?.correct ?? -1,
    });

    if (data.correct && (data.xp_awarded ?? 0) > 0) {
      setXpAmount(data.xp_awarded!);
      setXpKey((k) => k + 1);
      confetti({ particleCount: 120, spread: 60, origin: { y: 0.6 }, colors: ["#22c55e", "#fbbf24", "#f97316"] });
    }
  };

  const finnMood = result === null ? "thinking" : result.correct ? "excited" : "sad";

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--green)] border-t-transparent" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 text-center text-sm text-[var(--gray-500)]">
        No challenge today — check back tomorrow!
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 shadow-[var(--shadow-md)]">
      <div className="relative">
        <XpFloat xp={xpAmount} triggerKey={xpKey} />
      </div>

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Finn size={48} mood={finnMood} className="shrink-0" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--green)]">Daily Challenge</p>
          <p className="text-base font-bold text-[var(--black)] leading-snug">{challenge.question}</p>
        </div>
      </div>

      {/* Options */}
      <div className="grid gap-2">
        {challenge.options.map((opt, i) => {
          let variant: "default" | "correct" | "wrong" | "neutral" = "default";
          if (result !== null) {
            if (i === result.correctIdx) variant = "correct";
            else if (i === chosen) variant = "wrong";
            else variant = "neutral";
          }

          return (
            <button
              key={i}
              disabled={result !== null}
              onClick={() => submit(i)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                variant === "correct"
                  ? "border-[var(--green)] bg-[var(--green-bg)] text-[var(--green-deeper)]"
                  : variant === "wrong"
                    ? "border-red-300 bg-red-50 text-red-700"
                    : variant === "neutral"
                      ? "border-[var(--border)] bg-[var(--gray-50)] text-[var(--gray-400)] opacity-60"
                      : "border-[var(--border)] bg-[var(--gray-50)] hover:border-[var(--green)] hover:bg-[var(--green-bg)] hover:text-[var(--green-deeper)]"
              }`}
            >
              <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {variant === "correct" && ""}
              {variant === "wrong" && ""}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className={`mt-4 rounded-xl p-4 ${result.correct ? "bg-[var(--green-bg)] border border-[var(--green-border)]" : "bg-amber-50 border border-amber-200"}`}>
              <p className={`text-sm font-bold ${result.correct ? "text-[var(--green-deeper)]" : "text-amber-700"}`}>
                {result.correct ? <span className="inline-flex items-center gap-1">Correct! <span className="text-[1.1em] text-[var(--color-primary)]"><Icon.StarFilled /></span></span> : "Not quite — here's why:"}
              </p>
              <p className="mt-1 text-sm text-[var(--gray-700)]">{result.explanation}</p>
              {result.correct && (
                <p className="mt-2 text-xs font-semibold text-[var(--green-deeper)]">+{challenge.xp_reward} XP earned!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isGuest && !result && (
        <p className="mt-3 text-center text-xs text-[var(--gray-500)]">
          <a href="/auth/signup" className="font-semibold text-[var(--green)] underline-offset-2 hover:underline">
            Sign up free
          </a>{" "}
          to earn XP for your answer
        </p>
      )}
    </div>
  );
}
