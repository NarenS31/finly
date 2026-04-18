"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GuestLessonProgress } from "@/types";

function defaultEntry(): GuestLessonProgress {
  return {
    status: "not_started",
    scrollProgress: 0,
    answeredQuestions: {},
  };
}

interface ProgressState {
  guestProgress: Record<string, GuestLessonProgress>;
  updateProgress: (slug: string, patch: Partial<GuestLessonProgress>) => void;
  clearGuestProgress: () => void;
  syncToSupabase: () => Promise<{ ok: boolean; error?: string }>;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      guestProgress: {},
      updateProgress: (slug, patch) => {
        const existing = get().guestProgress[slug] ?? defaultEntry();
        set({
          guestProgress: {
            ...get().guestProgress,
            [slug]: { ...existing, ...patch },
          },
        });
      },
      clearGuestProgress: () => set({ guestProgress: {} }),
      syncToSupabase: async () => {
        const guestProgress = get().guestProgress;
        try {
          const res = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guestProgress }),
          });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            return { ok: false, error: (j as { error?: string }).error ?? res.statusText };
          }
          set({ guestProgress: {} });
          return { ok: true };
        } catch (e) {
          return { ok: false, error: e instanceof Error ? e.message : "Network error" };
        }
      },
    }),
    { name: "finpath_guest_progress" }
  )
);
