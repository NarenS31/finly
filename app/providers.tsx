"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useCurrencyStore } from "@/lib/store/currency-store";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrateFromLocale = useCurrencyStore((s) => s.hydrateFromLocale);

  useEffect(() => {
    hydrateFromLocale();
  }, [hydrateFromLocale]);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
