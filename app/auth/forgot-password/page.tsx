"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClientSiteUrl } from "@/lib/utils/site-url";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const supabase = createClient();
    const site = getClientSiteUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${site}/auth/login`,
    });
    setLoading(false);
    if (error) setMsg(error.message);
    else setMsg("Check your email for a reset link.");
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">Reset password</h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">We will email you a secure link.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {msg && <p className="text-sm text-[var(--color-text-secondary)]">{msg}</p>}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <Link href="/auth/login" className="mt-6 text-center text-sm font-semibold text-[var(--color-primary)]">
        Back to login
      </Link>
    </div>
  );
}
