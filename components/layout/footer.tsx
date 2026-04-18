import Link from "next/link";
import { FinlyLogo } from "@/components/layout/finly-logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--white)] px-6 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <FinlyLogo size="md" />
          <p className="mt-3 text-sm text-[var(--gray-500)]">Financial education for the next generation.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[var(--gray-700)]">
          <Link className="hover:text-[var(--green)]" href="/learn">
            Learn
          </Link>
          <Link className="hover:text-[var(--green)]" href="/curriculum">
            Curriculum
          </Link>
          <Link className="hover:text-[var(--green)]" href="/about">
            About
          </Link>
          <Link className="hover:text-[var(--green)]" href="/privacy">
            Privacy
          </Link>
        </nav>
        <p className="text-sm font-bold text-[var(--gray-400)]">100% free, always</p>
      </div>
    </footer>
  );
}
