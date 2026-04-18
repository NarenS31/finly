"use client";

import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export function ProgressChart() {
  const [mounted] = useState(() => typeof window !== "undefined");
  const data = [
    { topic: "Budget", value: 70 },
    { topic: "Saving", value: 55 },
    { topic: "Debt", value: 35 },
    { topic: "Invest", value: 48 },
  ];

  return (
    <div className="h-64 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
      <p className="mb-4 font-semibold">Progress by topic</p>
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6C63FF" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full animate-pulse rounded-2xl bg-zinc-100" />
      )}
    </div>
  );
}
