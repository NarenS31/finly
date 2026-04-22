import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { BookOpen, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingHero } from "@/components/layout/floating-hero";
import { homepageSteps, topicMeta } from "@/lib/data/site";
import { getAllLessons } from "@/lib/utils/lessons";
import { getPlatformStats } from "@/lib/utils/platform";
import { DailyChallenge } from "@/components/home/daily-challenge";
import { WeeklyPoll } from "@/components/home/weekly-poll";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const stats = await getPlatformStats();
  const lessons = getAllLessons();
  const featuredLessons = lessons.slice(0, 3);
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const isGuest = !auth.user;

  return (
    <div className="space-y-20 pb-8">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="painted-surface surface-grid overflow-hidden rounded-3xl border border-[#e8dfcf] px-8 py-12 shadow-[var(--shadow-hero)] lg:px-12 lg:py-14">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <Badge className="border-[#d9cfbd] bg-white">
              Ages 8–17 · Free
            </Badge>
            <h1 className="mt-5 text-5xl leading-[0.92] lg:text-[3.75rem]">
              Build money instincts before adulthood makes them expensive.
            </h1>
            <p className="mt-5 max-w-lg text-[1.05rem] leading-7 text-[var(--color-text-secondary)]">
              Practical financial education for ages 8–17. Real scenarios, real
              currencies, and decisions that matter wherever you live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                  asChild
                  className="bg-[var(--color-primary)] text-white shadow-[0_12px_26px_rgba(15,118,110,0.28)] hover:brightness-110"
                >
                  <a href="/learn">Start learning</a>
                </Button>
                <Button asChild variant="ghost">
                  <a href="/curriculum">See the curriculum</a>
                </Button>
            </div>
            <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
              Free · No account required ·{" "}
              <span className="font-medium text-[var(--color-text-primary)]">
                {stats.totalCountries}+
              </span>{" "}
              countries
            </p>
          </div>
          <FloatingHero />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section>
        <p className="label-eyebrow">How it works</p>
        <h2 className="mt-2 text-3xl font-bold">Simple by design</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[Target, BookOpen, TrendingUp].map((Icon, i) => (
            <div
              key={homepageSteps[i].title}
              className="rounded-2xl border border-[#e8dfcf] bg-white p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                <Icon className="h-5 w-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                {homepageSteps[i].title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                {homepageSteps[i].description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Topics ───────────────────────────────────────────── */}
      <section id="topics">
        <p className="label-eyebrow">Curriculum</p>
        <h2 className="mt-2 text-3xl font-bold">
          Eight topics, beginner to advanced
        </h2>
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(topicMeta).map(([key, value]) => (
            <a href="/learn" key={key}>
              <div className="group rounded-2xl border border-[#e8dfcf] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
                <div
                  className={`mb-4 h-1 w-10 rounded-full bg-gradient-to-r ${value.color}`}
                />
                <h3 className="font-bold text-[var(--color-text-primary)]">
                  {value.label}
                </h3>
                <p className="mt-1.5 text-sm leading-5 text-[var(--color-text-secondary)]">
                  {value.blurb}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Featured lessons ─────────────────────────────────── */}
      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="label-eyebrow">Start here</p>
            <h2 className="mt-2 text-3xl font-bold">Popular lessons</h2>
          </div>
          <Button asChild variant="ghost">
            <a href="/learn">View all</a>
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredLessons.map((lesson) => (
            <div
              key={lesson.slug}
              className="flex flex-col rounded-2xl border border-[#e8dfcf] bg-white p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                {lesson.topic}
              </span>
              <h3 className="mt-2 text-lg font-bold leading-snug">
                {lesson.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                {lesson.description}
              </p>
              <Button asChild className="mt-6">
                <a href={`/learn/${lesson.slug}`}>Open lesson</a>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Daily Challenge + Weekly Poll ────────────────────── */}
      <section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="label-eyebrow mb-3">Today's challenge</p>
            <DailyChallenge isGuest={isGuest} />
          </div>
          <div>
            <p className="label-eyebrow mb-3">What would you do?</p>
            <WeeklyPoll isGuest={isGuest} />
          </div>
        </div>
      </section>

      {/* ── Leaderboard teaser ───────────────────────────────── */}
      <section className="rounded-2xl border border-[#e8dfcf] bg-white p-6 text-center">
        <p className="flex justify-center"><span className="inline-block text-[2rem] text-[var(--color-primary)]"><Icon.Trophy /></span></p>
        <h2 className="mt-2 text-xl font-bold">Think you're the best?</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Compete with learners worldwide. Top 50 ranked by XP.</p>
        <Button asChild variant="ghost" className="mt-4">
          <a href="/leaderboard">See the leaderboard →</a>
        </Button>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="rounded-3xl bg-[#0f766e] px-8 py-12 text-white lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-4xl text-white">Ready to start?</h2>
            <p className="mt-3 max-w-md text-[1.05rem] leading-7 text-white/70">
              No subscription. No paywall. Pick a topic and begin in under a
              minute.
            </p>
          </div>
          <Button asChild variant="secondary" className="shrink-0">
            <a href="/learn" className="!text-white">Browse lessons</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
