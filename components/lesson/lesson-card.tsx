"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Circle, Clock3, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { topicMeta } from "@/lib/data/site";
import type { LessonMeta } from "@/types";
import { useProgressStore } from "@/lib/store/progress-store";

export function LessonCard({ lesson }: { lesson: LessonMeta }) {
  const progress = useProgressStore((s) => s.guestProgress[lesson.slug]);
  const topic = topicMeta[lesson.topic] ?? topicMeta.budgeting;
  const progressPct = Math.round(progress?.scrollProgress ?? 0);

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="card-lift">
      <Link href={`/learn/${lesson.slug}`} className="group block">
        <Card className="h-full overflow-hidden border-[var(--color-border)] bg-[var(--color-surface)] p-0 shadow-[var(--shadow-sm)]">
          <div className={`h-2 w-full bg-gradient-to-r ${topic.color}`} />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <Badge>{topic.label}</Badge>
              <ArrowUpRight className="h-4 w-4 text-[var(--color-text-secondary)] transition group-hover:text-[var(--color-primary)]" />
            </div>
            <h3 className="mt-3 text-lg font-bold leading-tight text-[var(--color-text-primary)] md:text-xl">{lesson.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-text-secondary)]">{lesson.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <Badge>
                <Clock3 className="mr-1 inline h-3 w-3" />
                {lesson.estimatedMinutes} min
              </Badge>
              <Badge>{lesson.difficulty}</Badge>
              <Badge className="text-[var(--color-secondary)]">
                <PlayCircle className="mr-1 inline h-3 w-3" />
                Interactive
              </Badge>
            </div>
            <div className="mt-5 rounded-2xl bg-[var(--color-bg)] p-3">
              <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-secondary)]">
                <span>
                  {progress?.status === "completed"
                    ? "Completed"
                    : progress?.status === "in_progress"
                      ? "In progress"
                      : "Not started"}
                </span>
                <span>{progress?.status === "completed" ? 100 : progressPct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
                <div
                  className={`h-full rounded-full transition-[width] duration-[600ms] ease-out ${
                    progress?.status === "completed" ? "bg-[var(--color-success)]" : "bg-[var(--color-warning)]"
                  }`}
                  style={{ width: `${progress?.status === "completed" ? 100 : progressPct}%` }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                {progress?.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span className="line-clamp-2">{topic.blurb}</span>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-[var(--color-primary)] opacity-0 transition group-hover:opacity-100">
              Start lesson →
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
