export default function AboutPage() {
  return (
    <article className="mx-auto max-w-5xl space-y-8">
      <section className="rounded-[32px] border border-white/60 bg-white/75 p-8 shadow-[var(--shadow-card)] backdrop-blur">
        <h1 className="text-5xl font-extrabold leading-tight">Why Finly exists</h1>
        <p className="mt-4 max-w-3xl editorial-copy">
          Money decisions start early, but financial education often starts too late. Finly gives kids and teens globally a free, self-directed way to build practical money confidence.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/60 bg-white/80 p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-2xl font-bold">Global</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">Examples should feel native, not translated from one country&apos;s assumptions.</p>
        </div>
        <div className="rounded-[24px] border border-white/60 bg-white/80 p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-2xl font-bold">Free</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">The students who need this most should not hit a paywall first.</p>
        </div>
        <div className="rounded-[24px] border border-white/60 bg-white/80 p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-2xl font-bold">Self-directed</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">No teacher required. Just clear paths, strong lessons, and useful tools.</p>
        </div>
      </section>
      <section className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-[var(--shadow-card)]">
        <h2 className="text-3xl font-bold">Built for real life</h2>
        <p className="mt-3 editorial-copy">Students learn budgeting, saving, debt awareness, and long-term planning with scenarios that mirror real choices, not abstract textbook questions.</p>
      </section>
    </article>
  );
}
