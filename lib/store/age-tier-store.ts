"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AgeTier } from "@/types";

interface AgeTierState {
  ageTier: AgeTier;
  setAgeTier: (ageTier: AgeTier) => void;
}

export const useAgeTierStore = create<AgeTierState>()(
  persist(
    (set) => ({
      ageTier: "13-17",
      setAgeTier: (ageTier) => set({ ageTier }),
    }),
    { name: "finpath_age_tier" }
  )
);
