import Link from "next/link";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {/* Hero card */}
      <section className="rounded-[32px] border border-white/60 bg-white/75 p-8 shadow-[var(--shadow-card)] backdrop-blur">
        <p className="label-eyebrow mb-3">Legal</p>
        <h1 className="text-5xl font-extrabold leading-tight">Privacy Policy</h1>
        <p className="mt-4 editorial-copy">
          Finly is built for kids and teens, so we take privacy seriously. We collect only what is needed to run lessons
          and optional accounts, and we never sell personal data.
        </p>
      </section>

      {/* Sections */}
      <section className="rounded-[24px] border border-white/60 bg-white/80 p-7 shadow-[var(--shadow-card)]">
        <h2 className="text-xl font-bold">What we collect</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          If you create an account we store your email address and the progress data you generate (completed lessons,
          quiz scores, streak counts). Guest users generate no stored personal data. We do not collect names, phone
          numbers, or payment information.
        </p>
      </section>

      <section className="rounded-[24px] border border-white/60 bg-white/80 p-7 shadow-[var(--shadow-card)]">
        <h2 className="text-xl font-bold">How we use it</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          Your data is used solely to power your learning experience — saving your place, tracking streaks, and showing
          progress. We do not use it for advertising and we do not share it with third parties for marketing purposes.
        </p>
      </section>

      <section className="rounded-[24px] border border-white/60 bg-white/80 p-7 shadow-[var(--shadow-card)]">
        <h2 className="text-xl font-bold">Cookies &amp; analytics</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          We use minimal, privacy-respecting analytics to understand which lessons are most useful. No fingerprinting,
          no cross-site tracking. Session cookies are used only for authentication.
        </p>
      </section>

      <section className="rounded-[24px] border border-white/60 bg-white/80 p-7 shadow-[var(--shadow-card)]">
        <h2 className="text-xl font-bold">Your rights</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          You can delete your account and all associated data at any time from your profile settings. For any other
          requests — including data export or questions about a child&apos;s account — email us at{" "}
          <a className="font-semibold text-[var(--color-primary)] hover:underline" href="mailto:hello@finly.app">
            hello@finly.app
          </a>
          .
        </p>
      </section>

      <div className="px-1 pb-8">
        <Link
          href="/"
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          ← Back home
        </Link>
      </div>
    </article>
  );
}
