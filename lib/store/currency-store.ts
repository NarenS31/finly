"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CURRENCY_OPTIONS, detectCurrency, type CurrencyOption } from "@/lib/utils/currency-config";

interface CurrencyState {
  currency: CurrencyOption;
  setCurrency: (c: CurrencyOption) => void;
  hydrateFromLocale: () => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: CURRENCY_OPTIONS[0],
      setCurrency: (currency) => set({ currency }),
      hydrateFromLocale: () => {
        if (typeof navigator === "undefined") return;
        set({ currency: detectCurrency() });
      },
    }),
    {
      name: "finpath_currency",
      partialize: (s) => ({ currency: s.currency }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.currency?.code) {
          state.currency = CURRENCY_OPTIONS[0];
        }
      },
    }
  )
);
