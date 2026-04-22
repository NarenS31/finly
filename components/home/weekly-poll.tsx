"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PollData {
  id: string;
  question: string;
  options: string[];
  counts: number[];
  total: number;
  myVote: number | null;
}

export function WeeklyPoll({ isGuest = false }: { isGuest?: boolean }) {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const fetchPoll = () =>
    fetch("/api/poll")
      .then((r) => r.json())
      .then((d: { poll?: PollData }) => setPoll(d.poll ?? null))
      .finally(() => setLoading(false));

  useEffect(() => { void fetchPoll(); }, []);

  const vote = async (idx: number) => {
    if (!poll || voting || poll.myVote !== null) return;
    setVoting(true);

    if (isGuest) {
      // Optimistic local-only update for guests
      const newCounts = [...poll.counts];
      newCounts[idx] = (newCounts[idx] ?? 0) + 1;
      setPoll({ ...poll, counts: newCounts, total: poll.total + 1, myVote: idx });
      setVoting(false);
      return;
    }

    await fetch("/api/poll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId: poll.id, optionIdx: idx }),
    });
    await fetchPoll();
    setVoting(false);
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--white)]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--green)] border-t-transparent" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 text-center text-sm text-[var(--gray-500)]">
        No poll this week — check back Monday!
      </div>
    );
  }

  const hasVoted = poll.myVote !== null;
  const topIdx = poll.counts.indexOf(Math.max(...poll.counts));

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 shadow-[var(--shadow-md)]">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--green)]">What Would You Do?</p>
        <p className="mt-1 text-base font-bold text-[var(--black)] leading-snug">{poll.question}</p>
        {hasVoted && (
          <p className="mt-1 text-xs text-[var(--gray-500)]">{poll.total} {poll.total === 1 ? "vote" : "votes"} so far</p>
        )}
      </div>

      <div className="grid gap-2">
        {poll.options.map((opt, i) => {
          const count = poll.counts[i] ?? 0;
          const pct = poll.total > 0 ? Math.round((count / poll.total) * 100) : 0;
          const isMyVote = poll.myVote === i;
          const isTop = hasVoted && i === topIdx;

          return (
            <button
              key={i}
              disabled={hasVoted || voting}
              onClick={() => vote(i)}
              className={`relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                hasVoted
                  ? isMyVote
                    ? "border-[var(--green)] text-[var(--green-deeper)]"
                    : "border-[var(--border)] text-[var(--gray-500)]"
                  : "border-[var(--border)] bg-[var(--gray-50)] hover:border-[var(--green)] hover:bg-[var(--green-bg)]"
              }`}
            >
              {/* Background bar */}
              {hasVoted && (
                <motion.div
                  className={`absolute inset-0 origin-left ${isMyVote ? "bg-[var(--green-bg)]" : "bg-[var(--gray-100)]"}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: pct / 100 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
              <span className="relative flex items-center justify-between">
                <span>{opt}</span>
                {hasVoted && (
                  <span className={`font-bold ${isMyVote ? "text-[var(--green-deeper)]" : "text-[var(--gray-400)]"}`}>
                    {pct}%
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {!hasVoted && (
        <p className="mt-3 text-center text-xs text-[var(--gray-500)]">No right or wrong answer — just pick what you'd really do!</p>
      )}
    </div>
  );
}
