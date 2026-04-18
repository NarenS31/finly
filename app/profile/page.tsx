import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/profile/stats-card";
import { AchievementBadge } from "@/components/profile/achievement-badge";
import { TopicRadarChart } from "@/components/profile/topic-radar-chart";
import { XpLevelSection } from "@/components/profile/xp-level-section";
import { LessonHistory, type HistoryRow } from "@/components/profile/lesson-history";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { Avatar } from "@/components/ui/avatar";
import { StreakPill } from "@/components/profile/streak-pill";

function embeddedLessonTopic(lessons: unknown): string | undefined {
  if (lessons && typeof lessons === "object" && !Array.isArray(lessons) && "topic" in lessons) {
    return (lessons as { topic: string }).topic;
  }
  if (Array.isArray(lessons) && lessons[0] && typeof lessons[0] === "object" && "topic" in lessons[0]) {
    return (lessons[0] as { topic: string }).topic;
  }
  return undefined;
}

const PROFILE_TOPICS: { label: string; keys: string[] }[] = [
  { label: "Budgeting", keys: ["budgeting"] },
  { label: "Saving", keys: ["saving"] },
  { label: "Investing", keys: ["investing"] },
  { label: "Debt & Credit", keys: ["debt", "credit"] },
  { label: "Banking", keys: ["banking"] },
  { label: "Goals", keys: ["goals"] },
  { label: "Tax", keys: ["tax"] },
];

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/auth/login?next=/profile");

  const userId = auth.user.id;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();

  const { data: completedLessons } = await supabase
    .from("lesson_progress")
    .select("id, quiz_score, quiz_correct, quiz_total, time_spent_seconds, completed_at, lesson_id, lessons(title, topic, slug)")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  const ageTier = profile?.age_tier ?? "8-12";

  const { data: allLessons } = await supabase
    .from("lessons")
    .select("topic")
    .eq("published", true)
    .in("age_tier", [ageTier, "both"]);

  const { data: allAchievements } = await supabase.from("achievements").select("*").order("condition_value", { ascending: true });

  const { data: earnedAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id, earned_at")
    .eq("user_id", userId);

  const earnedSet = new Set(earnedAchievements?.map((a) => a.achievement_id) ?? []);
  const earnedAtMap = new Map(earnedAchievements?.map((a) => [a.achievement_id, a.earned_at]) ?? []);

  const completed = completedLessons ?? [];
  const completedCount = completed.length;

  const scores = completed.map((l) => l.quiz_score).filter((s): s is number => s != null);
  const quizAvg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  const streak = profile?.streak_current ?? 0;
  const xp = profile?.xp ?? 0;
  const levelLabel = profile?.level ?? "Beginner";

  const topicData = PROFILE_TOPICS.map(({ label, keys }) => {
    const total = allLessons?.filter((l) => keys.includes(l.topic)).length ?? 0;
    const done = completed.filter((row) => {
      const t = embeddedLessonTopic(row.lessons);
      return t != null && keys.includes(t);
    }).length;
    return {
      topic: label,
      completion: total > 0 ? Math.round((done / total) * 100) : 0,
      fullMark: 100,
    };
  });

  const historyRows: HistoryRow[] = completed.map((r) => {
    const raw = r.lessons;
    const lesson =
      raw && typeof raw === "object" && !Array.isArray(raw)
        ? (raw as { title: string; topic: string; slug: string })
        : Array.isArray(raw) && raw[0]
          ? (raw[0] as { title: string; topic: string; slug: string })
          : null;
    return {
      id: r.id,
      quiz_score: r.quiz_score,
      quiz_correct: r.quiz_correct,
      quiz_total: r.quiz_total,
      time_spent_seconds: r.time_spent_seconds,
      completed_at: r.completed_at,
      lessons: lesson,
    };
  });

  const sortedAchievements = [...(allAchievements ?? [])].sort((a, b) => {
    const ae = earnedSet.has(a.id);
    const be = earnedSet.has(b.id);
    if (ae !== be) return ae ? -1 : 1;
    return (a.title ?? "").localeCompare(b.title ?? "");
  });

  const displayName = profile?.display_name ?? auth.user.email ?? "Student";

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="surface-grid rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)]">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">Dashboard</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Avatar name={displayName} size="lg" />
          <div>
            <h1 className="font-[var(--font-display)] text-4xl font-bold text-[var(--color-text-primary)]">
              Hi, {displayName}
            </h1>
            <p className="mt-3 editorial-copy">
              Track lessons, streaks, and quiz performance. Update preferences below — currency only affects calculators.
            </p>
          </div>
        </div>
        <StreakPill streak={streak} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Lessons completed" value={completedCount} />
        <StatsCard
          label="Current streak"
          value={`${streak} days`}
          className={streak >= 3 ? "streak-glow border-[var(--color-accent)]/40" : undefined}
        />
        <StatsCard label="Total XP" value={xp} />
        <StatsCard label="Quiz average" value={quizAvg != null ? `${quizAvg}%` : "—"} />
      </section>

      <XpLevelSection xp={xp} levelLabel={levelLabel} />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <TopicRadarChart data={topicData} />
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p className="text-lg font-bold text-[var(--color-text-primary)]">Settings</p>
          <div className="mt-4">
            <ProfileSettings
              initialDisplayName={profile?.display_name ?? displayName}
              initialAgeTier={ageTier}
              initialCurrency={profile?.currency_code ?? "USD"}
              initialStreakNotify={profile?.email_notify_streak ?? true}
              initialWeeklyNotify={profile?.email_notify_weekly ?? true}
            />
          </div>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">Achievements</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {sortedAchievements.map((a) => {
            const unlocked = earnedSet.has(a.id);
            return (
              <AchievementBadge
                key={a.id}
                title={a.title}
                description={a.description}
                unlocked={unlocked}
                earnedAt={unlocked ? earnedAtMap.get(a.id) ?? null : null}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">Lesson history</h2>
        <LessonHistory rows={historyRows} />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">Keep learning</h2>
        <Card className="border-[var(--color-border)] p-0">
          <div className="px-5 py-4">
            <Link href="/learn" className="font-semibold text-[var(--color-primary)]">
              Browse lesson library →
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
