"use client";

import { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export type TopicRadarRow = { topic: string; completion: number; fullMark: number };

export function TopicRadarChart({ data }: { data: TopicRadarRow[] }) {
  const [mounted] = useState(() => typeof window !== "undefined");
  const allZero = data.every((d) => d.completion === 0);

  if (!mounted) {
    return <div className="h-64 animate-pulse rounded-2xl bg-[var(--color-border)]/40" />;
  }

  if (allZero) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center text-sm text-[var(--color-text-secondary)]">
        Complete more lessons to see your progress map.
      </div>
    );
  }

  const primary = "#22c55e";

  return (
    <div className="h-72 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
      <p className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">Progress by topic</p>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis dataKey="topic" tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--color-text-muted)", fontSize: 10 }} />
          <Radar
            name="Completion"
            dataKey="completion"
            stroke={primary}
            fill={primary}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
