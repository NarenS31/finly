import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function AchievementBadge({
  title,
  description,
  unlocked,
  earnedAt,
}: {
  title: string;
  description?: string | null;
  unlocked: boolean;
  earnedAt?: string | null;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-[var(--color-border)] p-4 transition",
        unlocked ? "bg-[var(--color-surface)]" : "bg-[var(--color-bg)] opacity-95"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[var(--color-text-primary)]">{title}</p>
          {unlocked && description ? (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
          ) : null}
          {!unlocked ? (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Keep learning to unlock</p>
          ) : null}
          {unlocked && earnedAt ? (
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]",
            !unlocked && "blur-[2px] grayscale"
          )}
          aria-hidden
        >
          ★
        </div>
        {!unlocked && (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--color-surface)] p-1 shadow-sm" title="Locked">
            <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
          </span>
        )}
      </div>
    </Card>
  );
}
