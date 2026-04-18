import Link from "next/link";
import { BookOpen, Globe2, Sparkles, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FloatingConceptCards } from "@/components/layout/floating-concept-cards";
import { StatsBar } from "@/components/layout/stats-bar";
import { CurrencySelector } from "@/components/layout/currency-selector";
import { homeTopicShowcase, homepageSteps, testimonials } from "@/lib/data/site";
import { Avatar } from "@/components/ui/avatar";
import { getAllLessons } from "@/lib/utils/lessons";
import { getPlatformStats } from "@/lib/utils/platform";

export default async function HomePage() {
  const stats = await getPlatformStats();
  const lessons = getAllLessons();
  const counts = lessons.reduce<Record<string, number>>((acc, l) => {
    acc[l.topic] = (acc[l.topic] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="pb-20">
      <section className="painted-surface surface-grid mx-auto max-w-[1200px] overflow-hidden rounded-3xl border border-[var(--color-border)] px-6 py-12 shadow-[var(--shadow-lg)] sm:px-10 lg:px-12 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge className="bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">Ages 8–17 · Free</Badge>
            <h1 className="mt-5 max-w-xl font-[var(--font-display)] text-4xl font-extrabold leading-[1.08] tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-[3.5rem]">
              Learn money. Change your life.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--color-text-secondary)]">
              Free financial education for ages 8–17. No teacher needed. Built for the whole world.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/learn">Start learning — it&apos;s free</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/curriculum">See the curriculum</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
              🌍 Joined by students in <strong>{stats.totalCountries}+</strong> countries
            </p>
          </div>
          <FloatingConceptCards />
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <StatsBar
          lessonsCompleted={stats.totalLessonsCompleted}
          students={stats.totalUsers}
          countries={stats.totalCountries}
        />
      </div>

      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="label-eyebrow">How it works</p>
        <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">Three simple steps</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: "1", Icon: Target, ...homepageSteps[0] },
            { n: "2", Icon: BookOpen, ...homepageSteps[1] },
            { n: "3", Icon: TrendingUp, ...homepageSteps[2] },
          ].map((step) => (
            <Card key={step.n} className="card-lift border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
              <span className="font-[var(--font-display)] text-4xl font-extrabold text-[var(--color-primary)]">{step.n}</span>
              <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
                <step.Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[var(--color-text-primary)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="label-eyebrow">Topics</p>
        <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">What you&apos;ll learn</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeTopicShowcase.map((t) => (
            <Link key={t.title} href={`/learn?topic=${encodeURIComponent(t.topic)}`} className="group">
              <Card className="card-lift h-full border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-secondary-light)] text-[var(--color-secondary)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--color-text-primary)]">{t.title}</h3>
                <Badge className="mt-2">{t.difficulty}</Badge>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t.description}</p>
                <p className="mt-4 text-xs font-semibold text-[var(--color-primary)]">
                  {counts[t.topic] ?? 0} lessons in library →
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="label-eyebrow">Age tracks</p>
        <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">Same product, two calibrations</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)] lg:rounded-[var(--radius-card-foundation)]">
            <Badge>Foundation · 8–12</Badge>
            <h3 className="mt-4 text-2xl font-bold text-[var(--color-text-primary)]">Warm, spacious, encouraging</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Larger type, rounded cards, and Finn the coin guide celebrate progress. Language stays simple without
              talking down.
            </p>
            <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm text-[var(--color-text-secondary)]">
              <p className="font-semibold text-[var(--color-text-primary)]">Sample lesson</p>
              <p className="mt-1">Needs vs wants — build the instinct to pause before spending.</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/learn/needs-vs-wants">Preview lesson</Link>
              </Button>
            </div>
          </Card>
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)] lg:rounded-[var(--radius-card-teen)]">
            <Badge variant="outline">Real World · 13–17</Badge>
            <h3 className="mt-4 text-2xl font-bold text-[var(--color-text-primary)]">Peer-level, data-aware</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Sharper corners, denser layouts where it helps, and stakes that feel real — part-time jobs, phones, and
              first accounts.
            </p>
            <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm text-[var(--color-text-secondary)]">
              <p className="font-semibold text-[var(--color-text-primary)]">Sample lesson</p>
              <p className="mt-1">Compound interest — see the curve that changes decades.</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/learn/compound-interest">Preview lesson</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)] lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <Globe2 className="h-6 w-6" />
              <p className="label-eyebrow !text-[var(--color-primary-dark)]">Global</p>
            </div>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">Built for the whole world</h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
              We don&apos;t teach American finance or British finance. We teach money — the universal kind. The concepts
              work whether you&apos;re in Lagos, Mumbai, Jakarta, or London.
            </p>
            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              Full localization coming soon — want your language?{" "}
              <a className="font-semibold text-[var(--color-primary)]" href="mailto:hello@finpath.app">
                Let us know.
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Calculator currency</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Symbols update instantly — lessons stay USD-numeric for v1 so everyone shares the same examples.
            </p>
            <div className="mt-4">
              <CurrencySelector compact={false} />
            </div>
            <WorldDots />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="label-eyebrow">Voices</p>
        <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">Students are noticing</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-3">
                <Avatar name={t.name} size="lg" />
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.region}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">&ldquo;{t.quote}&rdquo;</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[var(--color-primary)] px-8 py-12 text-center text-white shadow-[var(--shadow-primary)] lg:px-16">
          <h2 className="font-[var(--font-display)] text-3xl font-bold lg:text-4xl">Ready to start? It&apos;s free, forever.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85">
            No ads. No paywalls. Optional account to save streaks and badges across devices.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <Link href="/auth/signup">Create free account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function WorldDots() {
  const dots = [
    { x: 12, y: 32 },
    { x: 22, y: 48 },
    { x: 38, y: 30 },
    { x: 48, y: 42 },
    { x: 58, y: 36 },
    { x: 70, y: 40 },
    { x: 78, y: 28 },
    { x: 30, y: 58 },
    { x: 52, y: 62 },
    { x: 68, y: 55 },
  ];
  return (
    <div className="mt-8">
      <svg viewBox="0 0 100 70" className="w-full text-[var(--color-primary-light)]" aria-hidden>
        <path
          fill="currentColor"
          opacity="0.35"
          d="M10 35 Q25 20 50 25 T90 30 Q85 50 55 55 T15 50 Z"
        />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="1.6" fill="#ff7043" className="motion-safe:animate-pulse">
            <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}
