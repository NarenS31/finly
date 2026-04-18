"use client";

import { useMemo, useState } from "react";
import { useAgeTierStore } from "@/lib/store/age-tier-store";
import { Button } from "@/components/ui/button";

const FOUNDATION_ITEMS: { id: string; label: string; answer: "need" | "want" }[] = [
  { id: "1", label: "School lunch", answer: "need" },
  { id: "2", label: "Extra toy when you already have plenty", answer: "want" },
  { id: "3", label: "Winter coat in a cold season", answer: "need" },
  { id: "4", label: "Designer stickers", answer: "want" },
  { id: "5", label: "Basic phone for safety", answer: "need" },
  { id: "6", label: "Latest game console upgrade", answer: "want" },
  { id: "7", label: "Medicine the doctor says you need", answer: "need" },
  { id: "8", label: "Candy every day after school", answer: "want" },
  { id: "9", label: "School supplies for class", answer: "need" },
  { id: "10", label: "Streaming extras you rarely use", answer: "want" },
  { id: "11", label: "Bus fare to school", answer: "need" },
  { id: "12", label: "Collectible cards “just because”", answer: "want" },
];

const TEEN_ITEMS: { id: string; label: string; answer: "need" | "want" }[] = [
  { id: "1", label: "Rent or housing share", answer: "need" },
  { id: "2", label: "Netflix when you already have two services", answer: "want" },
  { id: "3", label: "Groceries for the week", answer: "need" },
  { id: "4", label: "Brand-new phone yearly", answer: "want" },
  { id: "5", label: "Health insurance premium", answer: "need" },
  { id: "6", label: "Gym membership you never use", answer: "want" },
  { id: "7", label: "Car fuel for a job commute", answer: "need" },
  { id: "8", label: "Car with payments you cannot afford yet", answer: "want" },
  { id: "9", label: "Basic internet for school/work", answer: "need" },
  { id: "10", label: "Daily takeout coffee", answer: "want" },
  { id: "11", label: "Phone data for maps and safety", answer: "need" },
  { id: "12", label: "Concert tickets when savings are empty", answer: "want" },
];

export function NeedsWantsSorter() {
  const tier = useAgeTierStore((s) => s.ageTier);
  const items = useMemo(() => (tier === "8-12" ? FOUNDATION_ITEMS : TEEN_ITEMS), [tier]);
  const [bucket, setBucket] = useState<Record<string, "need" | "want" | null>>({});
  const [submitted, setSubmitted] = useState(false);

  function assign(id: string, b: "need" | "want") {
    setBucket((prev) => ({ ...prev, [id]: b }));
  }

  const wrong = useMemo(() => {
    if (!submitted) return [] as string[];
    return items.filter((it) => bucket[it.id] !== it.answer).map((it) => it.id);
  }, [submitted, items, bucket]);

  return (
    <div className="my-6 rounded-[var(--radius-card-teen)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] md:p-6">
      <p className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">Needs vs wants sorter</p>
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
        Tap <strong>Need</strong> or <strong>Want</strong> for each item. Needs keep you healthy, housed, learning, and
        earning. Wants are optional upgrades.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.id}
            className={`rounded-2xl border p-3 transition ${
              submitted
                ? wrong.includes(it.id)
                  ? "border-[var(--color-error)] bg-[var(--color-error-light)]"
                  : bucket[it.id] === it.answer
                    ? "border-[var(--color-success)] bg-[var(--color-success-light)]"
                    : "border-[var(--color-border)]"
                : "border-[var(--color-border)] bg-[var(--color-bg)]"
            }`}
          >
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{it.label}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => assign(it.id, "need")}
                disabled={submitted}
                className={`min-h-11 flex-1 rounded-xl border px-2 text-sm font-semibold transition ${
                  bucket[it.id] === "need"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]"
                }`}
              >
                Need
              </button>
              <button
                type="button"
                onClick={() => assign(it.id, "want")}
                disabled={submitted}
                className={`min-h-11 flex-1 rounded-xl border px-2 text-sm font-semibold transition ${
                  bucket[it.id] === "want"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-text-primary)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]"
                }`}
              >
                Want
              </button>
            </div>
            {submitted && (
              <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                Guide answer: <strong>{it.answer}</strong>
                {wrong.includes(it.id) ? " — your pick differed; context matters, but this is the learning label." : ""}
              </p>
            )}
          </div>
        ))}
      </div>
      {!submitted && (
        <Button className="mt-4 w-full min-h-12 sm:w-auto" type="button" onClick={() => setSubmitted(true)}>
          Check answers
        </Button>
      )}
    </div>
  );
}
