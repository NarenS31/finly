"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { AgeTierToggle } from "@/components/layout/age-tier-toggle";
import { Button } from "@/components/ui/button";
import { FinlyLogoLowebase } from "@/components/layout/finly-logo-lowebase";
import { FinlyLogo } from "@/components/layout/finly-logo";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/learn", label: "Learn" },
    { href: "/curriculum", label: "Curriculum" },
    { href: "/simulator", label: "Simulator" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/classes", label: "Classes" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 lg:px-8">
      <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between rounded-2xl border border-[#e8dfcf] bg-[rgba(255,252,246,0.92)] px-4 py-3 shadow-[0_4px_16px_rgba(31,41,55,0.07)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          <FinlyLogo size="md" />
        </Link>

        <div className="hidden items-center gap-2 rounded-full bg-white/70 p-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                pathname === link.href
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-text-primary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <AgeTierToggle />
          <Button asChild variant="ghost">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button
            asChild
            className="bg-[var(--color-primary)] text-white shadow-[0_12px_26px_rgba(15,118,110,0.28)] hover:brightness-110"
          >
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>

        <button
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-3 flex w-full max-w-[1200px] flex-col gap-4 rounded-2xl border border-[#e8dfcf] bg-[rgba(255,252,246,0.95)] p-4 shadow-[var(--shadow-card)] backdrop-blur-xl lg:hidden">
          <div className="grid gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                  pathname === link.href
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white text-[var(--color-text-primary)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <AgeTierToggle />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button asChild variant="ghost">
              <Link href="/auth/login" onClick={() => setOpen(false)}>Login</Link>
            </Button>
            <Button
              asChild
              className="bg-[var(--color-primary)] text-white shadow-[0_12px_26px_rgba(15,118,110,0.28)] hover:brightness-110"
            >
              <Link href="/auth/signup" onClick={() => setOpen(false)}>Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
