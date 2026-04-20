"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface XpFloatProps {
  /** Amount to show. Pass a new value each time you want a pop. */
  xp: number;
  /** Trigger key — increment this to fire a new animation */
  triggerKey: number;
}

/**
 * Shows a "+N XP" label that floats upward and fades out.
 * Usage:
 *   const [xpKey, setXpKey] = useState(0);
 *   const [xpAmount, setXpAmount] = useState(0);
 *   // when XP earned:
 *   setXpAmount(earned); setXpKey(k => k + 1);
 *   <XpFloat xp={xpAmount} triggerKey={xpKey} />
 */
export function XpFloat({ xp, triggerKey }: XpFloatProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerKey === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(t);
  }, [triggerKey]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          key={triggerKey}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -48, scale: 1.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 top-0 z-50 -translate-x-1/2 select-none rounded-full bg-[#fef9c3] px-3 py-1 text-sm font-extrabold text-[#854d0e] shadow"
          aria-live="polite"
        >
          +{xp} XP
        </motion.span>
      )}
    </AnimatePresence>
  );
}
