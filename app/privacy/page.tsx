import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-4xl font-bold text-[var(--color-text-primary)]">Privacy Policy</h1>
      <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
        FinPath collects only what is needed to run lessons and optional accounts. We do not sell personal data. For
        questions, contact{" "}
        <a className="font-semibold text-[var(--color-primary)]" href="mailto:hello@finpath.app">
          hello@finpath.app
        </a>
        .
      </p>
      <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
        <Link href="/" className="text-[var(--color-primary)]">
          ← Back home
        </Link>
      </p>
    </div>
  );
}
