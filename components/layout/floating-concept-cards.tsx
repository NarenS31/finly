"use client";

import { motion } from "framer-motion";

export function FloatingConceptCards() {
  return (
    <div className="relative mx-auto h-[340px] max-w-md lg:h-[380px]">
      <motion.div
        className="absolute left-0 top-8 w-[58%] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-md)]"
        animate={{ y: [0, -10, 0], rotate: [-2, -4, -2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-xs font-semibold text-[var(--color-primary)]">Budget</p>
        <div className="mt-3 flex h-24 items-end justify-center gap-1">
          {[40, 65, 35, 80, 50].map((h, i) => (
            <div
              key={i}
              className="w-3 rounded-t-md bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-secondary)]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </motion.div>
      <motion.div
        className="absolute right-0 top-0 w-[55%] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-lg)]"
        animate={{ y: [0, 12, 0], rotate: [3, 5, 3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-xs font-semibold text-[var(--color-secondary)]">Compound</p>
        <svg viewBox="0 0 120 70" className="mt-2 w-full">
          <path
            d="M5 60 Q40 55 70 35 T115 10"
            fill="none"
            stroke="#5c6bc0"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M5 60 L115 60"
            stroke="#e8eaf0"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-[12%] w-[70%] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-md)]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-xs font-semibold text-[var(--color-accent)]">Savings goal</p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-warning)]" />
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">72% toward goal</p>
      </motion.div>
    </div>
  );
}
