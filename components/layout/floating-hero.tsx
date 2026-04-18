"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Finn } from "@/components/mascot/finn";

const options = [
  { text: "Save it all", correct: false },
  { text: "Save at least 20%", correct: true },
  { text: "Spend it now", correct: false },
  { text: "Ask a parent", correct: false },
];

export function FloatingHero() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Finn floating above the card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 -mb-5"
      >
        <div className="relative">
          {/* Glow behind Finn */}
          <div className="absolute inset-0 rounded-full bg-orange-300/40 blur-xl scale-150" />
          <Finn size={90} className="relative drop-shadow-lg" />
          {/* Speech bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
            className="absolute -right-2 -top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[var(--color-text-primary)] shadow-md ring-1 ring-[var(--color-border)] whitespace-nowrap"
          >
            Let&apos;s go! 🎯
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
      >
      {/* Progress bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex gap-1">
          {[true, true, false, false, false].map((done, i) => (
            <div
              key={i}
              className={`h-1.5 w-10 rounded-full ${done ? "bg-[var(--color-primary)]" : "bg-gray-100"}`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-gray-400">2 of 5</span>
      </div>

      {/* Topic */}
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
        Budgeting · Lesson 2
      </p>

      {/* Question */}
      <h3 className="mt-2 text-[1.05rem] font-bold leading-snug text-[var(--color-text-primary)]">
        You earn $50 mowing lawns. How much should you save?
      </h3>

      {/* Answer options */}
      <div className="mt-5 space-y-2">
        {options.map((opt, i) => (
          <motion.div
            key={opt.text}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.07, duration: 0.3 }}
            className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium ${
              opt.correct
                ? "border-[var(--color-primary)] bg-teal-50 text-[var(--color-primary)]"
                : "border-gray-100 bg-gray-50 text-gray-500"
            }`}
          >
            {opt.text}
            {opt.correct && <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />}
          </motion.div>
        ))}
      </div>
      </motion.div>
    </div>
  );
}
