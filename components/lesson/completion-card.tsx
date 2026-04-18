"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { LessonMeta } from "@/types";

export function CompletionCard({
  open,
  takeaways,
  xp,
  nextLesson,
  onClose,
}: {
  open: boolean;
  takeaways: string[];
  xp: number;
  nextLesson?: LessonMeta;
  onClose: () => void;
}) {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    if (!open) return;
    const timers: number[] = [];
    requestAnimationFrame(() => {
      timers.push(window.setTimeout(() => setStars(1), 100));
      timers.push(window.setTimeout(() => setStars(2), 200));
      timers.push(window.setTimeout(() => setStars(3), 300));
    });
    return () => timers.forEach(clearTimeout);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Dismiss completion"
            className="fixed inset-0 z-[60] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="completion-title"
            className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-lg rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-lg)] md:inset-x-auto md:left-1/2 md:w-full md:-translate-x-1/2"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <h2 id="completion-title" className="text-2xl font-bold text-[var(--color-text-primary)]">
              Lesson complete!
            </h2>
            <div className="mt-3 flex gap-1" aria-hidden>
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`text-3xl transition-colors duration-200 ${i <= stars ? "text-[var(--color-warning)]" : "text-[var(--color-border)]"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm font-medium text-[var(--color-secondary)]">+{xp} XP earned</p>
            {takeaways.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--color-text-secondary)]">
                {takeaways.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              {nextLesson ? (
                <Button asChild className="btn-press flex-1 justify-center">
                  <Link href={`/learn/${nextLesson.slug}`}>Next lesson →</Link>
                </Button>
              ) : null}
              <Button asChild variant="ghost" className="btn-press flex-1 justify-center">
                <Link href="/learn">Back to library</Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
