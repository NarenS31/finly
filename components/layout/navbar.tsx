"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { CurrencySelector } from "@/components/layout/currency-selector";
import { AgeTierToggle } from "@/components/layout/age-tier-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks/use-auth";

export function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/learn", label: "Learn" },
    { href: "/curriculum", label: "Curriculum" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 lg:px-8">
      <nav
        className={`mx-auto flex w-full max-w-[1200px] items-center justify-between rounded-2xl border px-4 py-3 transition-[box-shadow,backdrop-filter,border-color] duration-200 ${
          scrolled
            ? "border-[var(--color-border)] bg-[var(--color-surface)]/80 shadow-[var(--shadow-sm)] backdrop-blur-xl"
            : "border-transparent bg-[var(--color-surface)]/70 shadow-[var(--shadow-sm)] backdrop-blur-md"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--color-text-primary)]"
          onClick={() => setOpen(false)}
        >
          <span className="font-[var(--font-display)] text-2xl font-extrabold tracking-tight text-[var(--color-primary-dark)]">
            FinPath
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pathname === link.href
                  ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <CurrencySelector />
          <AgeTierToggle />
          <ThemeToggle />
          {loading ? (
            <div className="hidden h-11 w-28 rounded-xl bg-[var(--color-border)]/50 lg:block" aria-hidden />
          ) : user ? (
            <Button asChild variant="ghost" className="gap-2 pr-2">
              <Link href="/profile" className="flex items-center gap-2">
                <Avatar name={user.email ?? "User"} size="sm" />
                <span className="max-w-[140px] truncate text-sm">Profile</span>
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[var(--color-bg)] px-6 pb-10 pt-24 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 text-lg font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CurrencySelector compact={false} />
            <AgeTierToggle />
            <ThemeToggle />
          </div>
          <div className="mt-auto grid gap-3">
            {!loading && user ? (
              <Button asChild variant="ghost" className="w-full justify-center py-4">
                <Link href="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
              </Button>
            ) : !loading ? (
              <>
                <Button asChild variant="ghost" className="w-full justify-center py-4">
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full justify-center py-4">
                  <Link href="/auth/signup" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
