import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  DollarSign,
  Flame,
  Shield,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AvatarBuilder } from "@/components/profile/avatar-builder";
import { ShareStatsCard } from "@/components/profile/share-stats-card";
import { MoneyGoalsTracker } from "@/components/profile/money-goals-tracker";
import { LessonHistory } from "@/components/profile/lesson-history";
import { AchievementBadge } from "@/components/profile/achievement-badge";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { AnimalCard } from "@/components/cards/animal-card";
import { ALL_CARDS } from "@/lib/cards";

type LessonProgressRow = {
  id: string;
  status: "not_started" | "in_progress" | "completed";
  completed_at: string | null;
  lessons:
    | {
        title?: string;
        slug?: string;
      }
    | Array<{
        title?: string;
        slug?: string;
      }>
    | null;
};

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  progress?: number;
  toneClassName: string;
};

type ActionTileProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const STATUS_STYLES: Record<
  LessonProgressRow["status"],
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className:
      "border-[var(--green-border)] bg-[var(--green-bg)] text-[var(--green-deeper)]",
  },
  in_progress: {
    label: "In progress",
    className:
      "border-[var(--amber-border)] bg-[var(--amber-bg)] text-[var(--amber-text)]",
  },
  not_started: {
    label: "Queued",
    className:
      "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)]",
  },
};

function readLessonMeta(value: LessonProgressRow["lessons"]) {
  if (!value) return { title: "Untitled lesson", slug: "" };
  if (Array.isArray(value)) {
    return {
      title: value[0]?.title ?? "Untitled lesson",
      slug: value[0]?.slug ?? "",
    };
  }
  return {
    title: value.title ?? "Untitled lesson",
    slug: value.slug ?? "",
  };
}

function formatActivityTime(value: string | null) {
  if (!value) return "Not started yet";
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  progress,
  toneClassName,
}: MetricCardProps) {
  return (
    <Card
      className={`card-lift overflow-hidden rounded-[28px] border-white/70 bg-[var(--color-surface)]/95 p-0 shadow-[0_30px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur ${toneClassName}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
              {label}
            </p>
            <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
              {value}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <Icon className="h-5 w-5 text-[var(--color-text-primary)]" />
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          {detail}
        </p>
        {typeof progress === "number" && (
          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-[var(--color-text-primary)]"
                style={{ width: `${Math.max(6, Math.min(progress, 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function ActionTile({ href, title, description, icon: Icon }: ActionTileProps) {
  return (
    <Link
      href={href}
      className="card-lift group rounded-[24px] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-4 transition hover:border-[var(--green-border)]"
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--green-bg)] text-[var(--green-deeper)]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-[var(--color-text-primary)]">
              {title}
            </p>
            <ArrowRight className="h-4 w-4 text-[var(--color-text-secondary)] transition group-hover:translate-x-0.5 group-hover:text-[var(--green-deeper)]" />
          </div>
          <p className="mt-1.5 text-sm leading-6 text-[var(--color-text-secondary)]">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/auth/login?next=/dashboard");
  }

  const userId = auth.user.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name,xp,level,streak_current,streak_shields,age_tier")
    .eq("id", userId)
    .single();

  const ageTiers = Array.from(new Set([profile?.age_tier ?? "both", "both"]));

  const [
    { data: lessonRows },
    { count: goalsCount },
    { count: completedLessonsCount },
    { count: inProgressLessonsCount },
    { count: attemptsCount },
    { count: achievementCount },
    { count: totalLessonsCount },
  ] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("id,status,completed_at,lessons(title,slug)")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false, nullsFirst: false })
      .limit(6),
    supabase
      .from("money_goals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("lesson_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed"),
    supabase
      .from("lesson_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "in_progress"),
    supabase
      .from("lesson_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("user_achievements")
      .select("achievement_id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("published", true)
      .in("age_tier", ageTiers),
  ]);

  const recentLessons = (lessonRows ?? []) as LessonProgressRow[];
  const displayName = profile?.display_name || "Student";
  const xp = profile?.xp ?? 0;
  const streak = profile?.streak_current ?? 0;
  const streakShields = profile?.streak_shields ?? 0;
  const levelLabel = profile?.level ?? "Beginner";
  const goalTotal = goalsCount ?? 0;
  const completedTotal = completedLessonsCount ?? 0;
  const inProgressTotal = inProgressLessonsCount ?? 0;
  const totalAttempts = attemptsCount ?? 0;
  const achievementsUnlocked = achievementCount ?? 0;
  const coveragePercent =
    totalLessonsCount && totalLessonsCount > 0
      ? Math.min(100, Math.round((completedTotal / totalLessonsCount) * 100))
      : 0;
  const completionRate =
    totalAttempts > 0 ? Math.round((completedTotal / totalAttempts) * 100) : 0;
  let nextLesson: LessonProgressRow | undefined = undefined;
  let nextLessonMeta = { slug: "", title: "Untitled lesson" };
  let nextLessonHref = "/learn";
  if (Array.isArray(recentLessons) && recentLessons.length > 0) {
    nextLesson = recentLessons.find((row) => row.status !== "completed") ?? recentLessons[0];
    nextLessonMeta = nextLesson ? readLessonMeta(nextLesson.lessons) : { slug: "", title: "Untitled lesson" };
    nextLessonHref = typeof nextLessonMeta?.slug === "string" && nextLessonMeta.slug.length > 0 ? `/learn/${nextLessonMeta.slug}` : "/learn";
  }

  return (
    <div className="space-y-6 pb-4">
      <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(246,255,249,0.96),rgba(235,250,241,0.94)_36%,rgba(255,247,237,0.9)_100%)] p-6 shadow-[0_40px_90px_-52px_rgba(34,197,94,0.55)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-12 top-10 h-44 w-44 rounded-full bg-[rgba(34,197,94,0.12)] blur-3xl" />
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-[rgba(249,115,22,0.12)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] bg-[size:28px_28px] opacity-60" />
        </div>

        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_380px] xl:items-center">
          <div>
            <h1 className="mt-2 max-w-3xl font-[var(--font-display)] text-4xl font-black leading-[0.95] tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl lg:text-[3.6rem]">
              Welcome back, {displayName}!
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg">
              Your money journey, streaks, goals, and next steps—all in one place. Jump in, track your progress, and level up your financial game.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <a href={nextLessonHref} className="!text-white">
                  {nextLessonMeta && nextLessonMeta.slug ? "Resume your next lesson" : "Browse lessons"}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full border-white/80 bg-white/70 px-6 backdrop-blur"
              >
                <a href="/simulator">Open spending simulator</a>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[var(--shadow-sm)] backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Course coverage
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {coveragePercent}%
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {completedTotal} completed out of {totalLessonsCount ?? 0} lessons.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[var(--shadow-sm)] backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Active goals
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {goalTotal}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Keep your money plans visible and moving.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[var(--shadow-sm)] backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Completion rate
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {completionRate}%
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Based on every lesson attempt you have logged.
                </p>
              </div>
            </div>
          </div>

          <Card className="relative overflow-hidden rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.82))] p-6 shadow-[0_40px_80px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,197,94,0.55),transparent)]" />
            <div className="flex items-center gap-4">
              <Avatar name={displayName} size="lg" className="ring-4 ring-white" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Today at a glance
                </p>
                <p className="text-xl font-black tracking-[-0.03em] text-[var(--color-text-primary)]">
                  {displayName}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Level {levelLabel}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-[22px] bg-[var(--green-bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green-deeper)]">
                  Streak
                </p>
                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {streak}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">days in a row</p>
              </div>
              <div className="rounded-[22px] bg-[var(--color-bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Shields
                </p>
                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {streakShields}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">streak saves ready</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                Next focus
              </p>
              <p className="mt-2 text-lg font-bold text-[var(--color-text-primary)]">
                {nextLessonMeta?.title ?? "Start your next lesson"}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                {nextLesson
                  ? `${STATUS_STYLES[nextLesson.status].label} ${formatActivityTime(nextLesson.completed_at)}.`
                  : "You have a clean slate. Pick a lesson and build momentum."}
              </p>
              <Link
                href={nextLessonHref}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--green-deeper)]"
              >
                Jump in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={TrendingUp}
          label="Total XP"
          value={xp.toLocaleString()}
          detail={`You’re building real momentum, and ${levelLabel.toLowerCase()} is your current lane.`}
          toneClassName="bg-[linear-gradient(180deg,rgba(240,253,244,1),rgba(255,255,255,0.94))]"
        />
        <MetricCard
          icon={BookOpen}
          label="Lessons completed"
          value={completedTotal.toString()}
          detail={`You’ve explored ${coveragePercent}% of the published lesson library for your tier.`}
          progress={coveragePercent}
          toneClassName="bg-[linear-gradient(180deg,rgba(239,246,255,0.92),rgba(255,255,255,0.96))]"
        />
        <MetricCard
          icon={Flame}
          label="Current streak"
          value={`${streak} days`}
          detail={
            streakShields > 0
              ? `${streakShields} streak shield${streakShields === 1 ? "" : "s"} ready if life gets messy.`
              : "No shields banked right now, so keep the streak alive."
          }
          toneClassName="bg-[linear-gradient(180deg,rgba(255,247,237,0.98),rgba(255,255,255,0.96))]"
        />
        <MetricCard
          icon={Trophy}
          label="Achievements"
          value={achievementsUnlocked.toString()}
          detail={`You’re tracking ${goalTotal} money goal${goalTotal === 1 ? "" : "s"} alongside your learning.`}
          toneClassName="bg-[linear-gradient(180deg,rgba(250,245,255,0.94),rgba(255,255,255,0.96))]"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <Card className="overflow-hidden rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-0 shadow-[0_35px_70px_-50px_rgba(15,23,42,0.45)]">
          <div className="border-b border-[var(--color-border)] px-6 py-5 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--green-deeper)]">
                  Recent activity
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  Lesson runway
                </h2>
              </div>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--green-border)] hover:text-[var(--green-deeper)]"
              >
                Browse lesson library
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] bg-[var(--color-bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Attempts
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {totalAttempts}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--green-bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green-deeper)]">
                  Completed
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {completedTotal}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--amber-bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--amber-text)]">
                  In progress
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {inProgressTotal}
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {recentLessons.length === 0 ? (
              <div className="px-6 py-12 text-center sm:px-7">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green-bg)] text-[var(--green-deeper)]">
                  <BookOpen className="h-7 w-7" />
                </div>
                <p className="mt-5 text-xl font-bold text-[var(--color-text-primary)]">
                  No lesson activity yet
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
                  Start your first lesson and this space will turn into a proper
                  progress feed instead of empty chrome.
                </p>
                <Button asChild className="mt-6 rounded-full px-6">
                  <a href="/learn">Start learning</a>
                </Button>
              </div>
            ) : (
              recentLessons.map((row, index) => {
                const lesson = readLessonMeta(row.lessons);
                const href = lesson.slug ? `/learn/${lesson.slug}` : "/learn";
                const status = STATUS_STYLES[row.status];

                return (
                  <Link
                    key={row.id}
                    href={href}
                    className="group flex flex-col gap-4 px-6 py-5 transition hover:bg-[var(--color-bg)]/70 sm:px-7 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white text-sm font-black text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-lg font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
                            {lesson.title}
                          </p>
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                          <span className="inline-flex items-center gap-2">
                            <Clock3 className="h-4 w-4" />
                            {formatActivityTime(row.completed_at)}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            {row.status === "completed"
                              ? "Wrapped up"
                              : row.status === "in_progress"
                                ? "Still moving"
                                : "Ready when you are"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--green-deeper)]">
                      Open lesson
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,255,249,0.92))] p-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.4)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--green-deeper)]">
              Quick actions
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
              Keep the engine running
            </h2>
            <div className="mt-5 space-y-3">
              <ActionTile
                href="/profile"
                title="Tune your profile"
                description="Update your display name, streak settings, and avatar without leaving the flow."
                icon={Shield}
              />
              <ActionTile
                href="/simulator"
                title="Run the simulator"
                description="Stress-test spending choices and make the learning feel more real."
                icon={DollarSign}
              />
              <ActionTile
                href="/leaderboard"
                title="Check the leaderboard"
                description="See where your XP puts you and chase the next jump up the table."
                icon={Trophy}
              />
            </div>
          </Card>

          <Card className="rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.4)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Momentum snapshot
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                  Your focus stack
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--green-bg)] text-[var(--green-deeper)]">
                <Target className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Course coverage
                  </p>
                  <p className="text-sm font-bold text-[var(--green-deeper)]">
                    {coveragePercent}%
                  </p>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--color-bg)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--green),#8b5cf6)]"
                    style={{ width: `${Math.max(4, coveragePercent)}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                    In progress right now
                  </p>
                  <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                    {inProgressTotal}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Lessons already underway and waiting for a finish.
                  </p>
                </div>
                <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                    Goal tracker
                  </p>
                  <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                    {goalTotal}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Active money goals keeping the work grounded in real life.
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(34,197,94,0.12),rgba(249,115,22,0.1),rgba(255,255,255,0.9))] p-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Strongest signal
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {streak > 0
                    ? `A ${streak}-day streak is doing most of the heavy lifting right now. Protect it, and your dashboard keeps compounding.`
                    : "Your cleanest win is simply getting moving again. One completed lesson will make this dashboard light up fast."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
      {/* --- Card Collection Teaser --- */}
      <section className="relative overflow-hidden rounded-[32px] border border-amber-200/60 bg-[linear-gradient(135deg,rgba(255,251,235,0.98),rgba(254,243,199,0.9))] p-6 shadow-[0_30px_60px_-40px_rgba(245,158,11,0.35)]">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[rgba(245,158,11,0.1)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[rgba(139,92,246,0.08)] blur-2xl" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
                ✦ Collectible Cards
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
                The Animal Roster
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--color-text-secondary)]">
                Earn cards by completing lessons and challenges. 7 characters, 4 rarities — trade with friends and build your deck.
              </p>
            </div>
            <Link
              href="/cards"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white/80 px-4 py-2 text-sm font-bold text-amber-700 shadow-sm transition hover:bg-amber-50"
            >
              View all cards
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {ALL_CARDS.filter((_, i) => [0, 5, 8, 13, 19].includes(i)).map((card) => (
              <AnimalCard key={card.id} card={card} size="sm" />
            ))}
          </div>
        </div>
      </section>

      {/* --- Additional Features Section --- */}
      <div className="mt-12 grid gap-8 xl:grid-cols-2">
        <div className="space-y-8">
          {/* Avatar Builder */}
          <Card className="p-0 overflow-visible">
            <div className="p-6">
              <AvatarBuilder userXp={xp} />
            </div>
          </Card>

          {/* Share Your Stats */}
          <ShareStatsCard displayName={displayName} xp={xp} streak={streak} level={levelLabel} />

          {/* Money Goals */}
          <MoneyGoalsTracker />
        </div>
        <div className="space-y-8">
          {/* Achievements */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Achievements</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Example badges, replace with dynamic data if available */}
              <AchievementBadge title="Both Worlds" unlocked={false} />
              <AchievementBadge title="Budget Boss" unlocked={false} />
              <AchievementBadge title="Compound Explorer" unlocked={false} />
              <AchievementBadge title="Finance Pro" unlocked={false} />
              <AchievementBadge title="First Step" unlocked={false} />
              <AchievementBadge title="Global Citizen" unlocked={false} />
              <AchievementBadge title="Month Master" unlocked={false} />
              <AchievementBadge title="Quiz Ace" unlocked={false} />
              <AchievementBadge title="Saver" unlocked={false} />
              <AchievementBadge title="Sharing is Caring" unlocked={false} />
              <AchievementBadge title="Speed Learner" unlocked={false} />
              <AchievementBadge title="Week Warrior" unlocked={false} />
            </div>
          </Card>

          {/* Lesson History */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Lesson history</h2>
            {/* Pass empty array or fetch real data as needed */}
            <LessonHistory rows={[]} />
          </Card>

          {/* Profile Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            {/* Example props, replace with real user data */}
            <ProfileSettings
              initialDisplayName={displayName}
              initialAgeTier={profile?.age_tier || "13-17"}
              initialCurrency={"USD"}
              initialStreakNotify={true}
              initialWeeklyNotify={true}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
