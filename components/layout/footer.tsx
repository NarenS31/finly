import Link from "next/link";
import { CurrencySelector } from "@/components/layout/currency-selector";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 pb-12 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-[1.2fr_1fr_auto]">
        <div>
          <p className="font-[var(--font-display)] text-3xl font-extrabold text-[var(--color-text-primary)]">FinPath</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)]">
            The first financial literacy platform built for kids, not their teachers.
          </p>
          <p className="mt-4 text-sm font-semibold text-[var(--color-primary)]">100% free, always. No ads. No paywalls.</p>
        </div>
        <div className="grid gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
          <Link className="hover:text-[var(--color-text-primary)]" href="/learn">
            Learn
          </Link>
          <Link className="hover:text-[var(--color-text-primary)]" href="/curriculum">
            Curriculum
          </Link>
          <Link className="hover:text-[var(--color-text-primary)]" href="/about">
            About
          </Link>
          <Link className="hover:text-[var(--color-text-primary)]" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="hover:text-[var(--color-text-primary)]" href="mailto:hello@finpath.app">
            Contact
          </Link>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <CurrencySelector compact={false} />
          <p className="text-xs text-[var(--color-text-muted)]">© {new Date().getFullYear()} FinPath</p>
        </div>
      </div>
    </footer>
  );
}
