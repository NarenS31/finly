import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/icons";

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
        "relative overflow-hidden border-[var(--border)] p-4 transition",
        unlocked ? "border-[var(--green)] bg-[var(--white)]" : "bg-[var(--gray-50)] opacity-95"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[var(--black)]">{title}</p>
          {unlocked && description ? (
            <p className="mt-1 text-sm text-[var(--gray-700)]">{description}</p>
          ) : null}
          {!unlocked ? (
            <p className="mt-1 text-sm text-[var(--gray-400)]">Keep learning to unlock</p>
          ) : null}
          {unlocked && earnedAt ? (
            <p className="mt-2 text-xs text-[var(--green-deeper)]">Earned {new Date(earnedAt).toLocaleDateString()}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--green-bg)] text-[var(--green)]",
            !unlocked && "blur-[2px] grayscale"
          )}
          aria-hidden
        >
          <Icon.Trophy className="h-5 w-5" />
        </div>
        {!unlocked && (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--white)] p-1 shadow-sm" title="Locked">
            <Icon.Lock className="h-4 w-4 text-[var(--gray-400)]" />
          </span>
        )}
      </div>
    </Card>
  );
}
