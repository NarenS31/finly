"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrencyStore } from "@/lib/store/currency-store";
import { PasswordStrength } from "@/components/auth/password-strength";
import { getClientSiteUrl } from "@/lib/utils/site-url";

export function SignupForm() {
  const router = useRouter();
  const currency = useCurrencyStore((s) => s.currency);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageTier, setAgeTier] = useState<"8-12" | "13-17">("13-17");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guestHint] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem("finly_guest_progress");
      if (!raw) return false;
      const parsed = JSON.parse(raw) as {
        state?: { guestProgress?: Record<string, unknown> };
        guestProgress?: Record<string, unknown>;
      };
      const gp = parsed?.state?.guestProgress ?? parsed?.guestProgress ?? {};
      return Object.keys(gp).length > 0;
    } catch {
      return false;
    }
  });

  const strength = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    return s;
  }, [password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!terms) return setError("Please accept the Terms of Service and Privacy Policy.");
    if (strength < 2) return setError("Please choose a stronger password.");
    setSubmitting(true);
    setError("");
    setNotice("");

    const supabase = createClient();
    const site = getClientSiteUrl();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${site}/auth/callback?next=/dashboard`,
      },
    });
    if (signUpError) {
      setSubmitting(false);
      return setError(signUpError.message);
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        display_name: displayName || "Student",
        age_tier: ageTier,
        currency_code: currency.code,
        onboarding_complete: false,
      });

      void fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, name: displayName || "there" }),
      });
    }

    if (!data.session) {
      setSubmitting(false);
      setNotice("Account created. Check your email to confirm your account, then log in.");
      router.push(`/auth/login?email=${encodeURIComponent(email)}&checkEmail=1`);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {guestHint && (
        <div className="rounded-2xl border border-[var(--color-secondary)] bg-[var(--color-secondary-light)] px-4 py-3 text-sm text-[var(--color-text-primary)]">
          We found progress from before — you can sync it after signing up from your profile.
        </div>
      )}
      <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
          <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
          Create your Finly account
        </div>
        <div className="space-y-3">
          <Input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div>
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <PasswordStrength strength={strength} />
          </div>
          <label className="grid gap-1 text-sm font-medium text-[var(--color-text-secondary)]">
            Age tier
            <select
              value={ageTier}
              onChange={(e) => setAgeTier(e.target.value as "8-12" | "13-17")}
              className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)]"
            >
              <option value="8-12">Foundation (8–12)</option>
              <option value="13-17">Real World (13–17)</option>
            </select>
          </label>
          <p className="text-xs text-[var(--color-text-muted)]">
            Currency for calculators: <strong>{currency.symbol}</strong> {currency.label} — change anytime in the nav.
          </p>
        </div>
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1" />
        <span>I agree to the Terms of Service and Privacy Policy.</span>
      </label>
      {notice && <p className="text-sm text-[var(--color-secondary)]">{notice}</p>}
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      <Button className="w-full min-h-12" type="submit">
        {submitting ? "Creating account…" : "Create account"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
