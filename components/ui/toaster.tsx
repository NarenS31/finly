"use client";

import { useToastStore } from "@/lib/store/toast-store";

export function Toaster() {
  const message = useToastStore((s) => s.message);
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[100] max-w-sm -translate-x-1/2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-lg)] motion-safe:animate-[toastUp_0.25s_ease-out]"
    >
      {message}
    </div>
  );
}
