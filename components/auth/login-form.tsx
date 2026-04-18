"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setSubmitting(false);
      return setError(authError.message);
    }
    router.push("/profile");
    router.refresh();
  }

  async function onGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/profile` } });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
          <Mail className="h-4 w-4" />
          Use your email
        </div>
        <div className="space-y-3">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      <Button className="w-full min-h-12" type="submit">
        {submitting ? "Logging in…" : "Log in"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button className="w-full min-h-12" type="button" variant="ghost" onClick={onGoogle}>
        Continue with Google
      </Button>
      <div className="rounded-[20px] border border-[var(--color-secondary)] bg-[var(--color-secondary-light)] p-4 text-sm text-[var(--color-text-primary)]">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-4 w-4 text-[var(--color-secondary)]" />
          Safe and simple
        </div>
        <p className="mt-2 text-[var(--color-text-secondary)]">Your account keeps progress across lessons and quizzes.</p>
      </div>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <Link href="/auth/forgot-password" className="font-semibold text-[var(--color-primary)]">
          Forgot password?
        </Link>
        <Link href="/auth/signup" className="font-semibold text-[var(--color-primary)]">
          Sign up instead
        </Link>
        <Link href="/learn" className="w-full text-center text-[var(--color-text-secondary)]">
          Continue as guest →
        </Link>
      </div>
    </form>
  );
}
