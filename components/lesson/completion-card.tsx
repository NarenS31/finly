"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
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
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">("idle");

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

  const handleChallengeFriend = async () => {
    const url = nextLesson ? `${window.location.origin}/learn/${nextLesson.slug}` : window.location.href;
    const text = `I just finished a Finly lesson and earned ${xp} XP. Think you can beat me?`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Challenge me on Finly",
          text,
          url,
        });
        setShareState("shared");
        return;
      }

      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareState("copied");
    } catch {
      setShareState("idle");
    }
  };

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
            className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-lg border-t-[3px] border-[var(--green)] bg-[var(--white)] p-6 shadow-[var(--shadow-lg)] md:inset-x-auto md:left-1/2 md:w-full md:-translate-x-1/2 md:rounded-t-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <h2 id="completion-title" className="text-xl font-extrabold text-[var(--black)]">
              Lesson complete!
            </h2>
            <div className="mt-3 flex gap-1" aria-hidden>
              {[1, 2, 3].map((i) => (
                <Icon.StarFilled
                  key={i}
                  className={`h-8 w-8 transition-opacity duration-200 ${i <= stars ? "text-[#fbbf24]" : "text-[var(--gray-200)]"}`}
                />
              ))}
            </div>
            <p className="pill-xp mt-3 inline-block">+{xp} XP</p>
            {takeaways.length > 0 && (
              <ul className="mt-4 space-y-2">
                {takeaways.map((t) => (
                  <li key={t} className="flex gap-2 text-sm text-[var(--gray-700)]">
                    <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--green)]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="ghost" className="btn-press flex-1 justify-center" onClick={handleChallengeFriend}>
                {shareState === "idle" ? "Challenge a friend" : shareState === "shared" ? "Challenge sent" : "Link copied"}
              </Button>
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
