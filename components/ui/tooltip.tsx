"use client";

import { useState } from "react";

export function Tooltip({
  children,
  content,
  position = "top",
}: {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}) {
  const [open, setOpen] = useState(false);

  const pos =
    position === "bottom"
      ? "top-full left-1/2 mt-2 -translate-x-1/2"
      : position === "left"
        ? "right-full top-1/2 mr-2 -translate-y-1/2"
        : position === "right"
          ? "left-full top-1/2 ml-2 -translate-y-1/2"
          : "bottom-full left-1/2 mb-2 -translate-x-1/2";

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute z-50 w-max max-w-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text-secondary)] shadow-[var(--shadow-md)] ${pos}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
