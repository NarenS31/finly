"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";

const PALETTE = [
  "bg-[#5c6bc0] text-white",
  "bg-[#26a69a] text-white",
  "bg-[#ff7043] text-white",
  "bg-[#3949ab] text-white",
  "bg-[#43a047] text-white",
  "bg-[#fb8c00] text-white",
  "bg-[#7e57c2] text-white",
  "bg-[#00838f] text-white",
];

function hashName(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const color = useMemo(() => PALETTE[hashName(name) % PALETTE.length], [name]);
  const sz = size === "sm" ? "h-8 w-8 min-h-8 min-w-8 text-xs" : size === "lg" ? "h-14 w-14 min-h-14 min-w-14 text-lg" : "h-10 w-10 min-h-10 min-w-10 text-sm";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold",
        color,
        sz,
        className
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
