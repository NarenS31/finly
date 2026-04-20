import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

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

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/auth/login?next=/dashboard");
  }

  const userId = auth.user.id;

  const [{ data: profile }, { data: lessonRows }, { count: goalsCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name,xp,level,streak_current,streak_shields")
      .eq("id", userId)
      .single(),
    supabase
      .from("lesson_progress")
      .select("id,status,completed_at,lessons(title,slug)")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false, nullsFirst: false })
      .limit(5),
    supabase.from("money_goals").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  const recentLessons = (lessonRows ?? []) as LessonProgressRow[];
  const completedCount = recentLessons.filter((row) => row.status === "completed").length;
  const inProgressCount = recentLessons.filter((row) => row.status === "in_progress").length;
  const displayName = profile?.display_name || auth.user.email || "Student";

  return (
    <div className="space-y-8">
      <section className="surface-grid rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)]">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">Your dashboard</p>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl font-bold leading-tight text-[var(--color-text-primary)]">
          Welcome back, {displayName}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-text-secondary)]">
          This is your control center: progress, streak health, and your next best actions in one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-[var(--color-border)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">Total XP</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]">{profile?.xp ?? 0}</p>
        </Card>
        <Card className="rounded-2xl border-[var(--color-border)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">Current level</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]">{profile?.level ?? "Beginner"}</p>
        </Card>
        <Card className="rounded-2xl border-[var(--color-border)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">Streak</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]">{profile?.streak_current ?? 0} days</p>
        </Card>
        <Card className="rounded-2xl border-[var(--color-border)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">Streak shields</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]">{profile?.streak_shields ?? 0}</p>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-2xl border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Recent lesson activity</h2>
            <Link href="/learn" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              Browse lessons
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentLessons.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)]">No lesson attempts yet. Start your first lesson now.</p>
            )}
            {recentLessons.map((row) => {
              const lesson = readLessonMeta(row.lessons);
              const href = lesson.slug ? `/learn/${lesson.slug}` : "/learn";
              return (
                <Link
                  key={row.id}
                  href={href}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition hover:border-[var(--color-primary)]"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">{lesson.title}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {row.status === "completed" ? "Completed" : row.status === "in_progress" ? "In progress" : "Not started"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-primary)]">Open</span>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="rounded-2xl border-[var(--color-border)] p-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Quick actions</h2>
          <div className="mt-4 grid gap-3">
            <Link
              href="/profile"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-primary)]"
            >
              Open full profile
            </Link>
            <Link
              href="/simulator"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-primary)]"
            >
              Run spending simulator
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-primary)]"
            >
              View leaderboard
            </Link>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <p className="text-sm text-[var(--color-text-secondary)]">Learning pulse</p>
            <p className="mt-2 text-sm text-[var(--color-text-primary)]">
              {completedCount} completed in your latest 5 attempts, {inProgressCount} still in progress, and {goalsCount ?? 0} money goals tracked.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
