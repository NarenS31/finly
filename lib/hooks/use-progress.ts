"use client";

import { useProgressStore } from "@/lib/store/progress-store";
import type { GuestLessonProgress } from "@/types";

export function useProgress(slug: string) {
  const entry = useProgressStore((s) => s.guestProgress[slug]);
  const updateProgress = useProgressStore((s) => s.updateProgress);

  return {
    entry,
    setLessonProgress: (patch: Partial<GuestLessonProgress>) => updateProgress(slug, patch),
  };
}
