"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Finn } from "@/components/mascot/finn";
import { useAgeTierStore } from "@/lib/store/age-tier-store";
import { useCurrencyStore } from "@/lib/store/currency-store";
import { CURRENCY_OPTIONS } from "@/lib/utils/currency-config";
import { Icon } from "@/components/ui/icons";

const topics812 = [
  { id: "needs-vs-wants", title: "Needs vs wants", blurb: "Build the pause before you spend." },
  { id: "what-is-money", title: "What is money?", blurb: "From barter to digital balances." },
];

const topics1317 = [
  { id: "compound-interest", title: "Compound interest", blurb: "See the curve that rewards patience." },
  { id: "the-50-30-20-rule", title: "50/30/20 budgeting", blurb: "Split income with intention." },
  { id: "how-banks-work", title: "How banks work", blurb: "Follow deposits through the system." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const setAgeTier = useAgeTierStore((s) => s.setAgeTier);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const [step, setStep] = useState(0);
  const [tier, setTier] = useState<"8-12" | "13-17">("13-17");
  const [first, setFirst] = useState<string>(tier === "8-12" ? "needs-vs-wants" : "compound-interest");

  async function finish() {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.from("profiles").update({ age_tier: tier, onboarding_complete: true }).eq("id", data.user.id);
      
      // Check for pending class code
      const pendingCode = typeof window !== "undefined" ? sessionStorage.getItem("pendingClassCode") : null;
      if (pendingCode) {
        sessionStorage.removeItem("pendingClassCode");
        
        // Find class by code
        const { data: cls } = await supabase
          .from("classes")
          .select("id")
          .eq("code", pendingCode.toUpperCase())
          .is("archived_at", null)
          .single();
        
        if (cls) {
          // Join class
          await supabase.from("class_members").insert({ class_id: cls.id, user_id: data.user.id });
          // Redirect to learn with joined flag
          setAgeTier(tier);
          router.push(`/learn?joined=true`);
          return;
        }
      }
    }
    setAgeTier(tier);
    router.push(`/learn/${first}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-semibold text-[var(--color-primary)]">Step {step + 1} of 3</p>
      {step === 0 && (
        <div className="mt-6 space-y-4">
          <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">How old are you?</h1>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setTier("8-12");
                setFirst("needs-vs-wants");
                setStep(1);
              }}
              className="rounded-3xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-left shadow-[var(--shadow-sm)] transition hover:border-[var(--color-primary)]"
            >
              <Finn />
              <p className="mt-4 text-lg font-bold">Foundation · 8–12</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Warmer pacing, Finn as a guide, and playful progress.</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setTier("13-17");
                setFirst("compound-interest");
                setStep(1);
              }}
              className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-left shadow-[var(--shadow-sm)] transition hover:border-[var(--color-primary)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--green-bg)] text-[var(--green)]">
                <Icon.BookOpen className="h-8 w-8" />
              </div>
              <p className="mt-4 text-lg font-bold">Real World · 13–17</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Peer-level tone, sharper layouts, real stakes.</p>
            </button>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="mt-6 space-y-4">
          <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">Pick your currency</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This only changes symbols in calculators — lessons stay universal.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CURRENCY_OPTIONS.map((c) => (
              <Card
                key={c.code}
                className="cursor-pointer border-[var(--color-border)] p-4 transition hover:border-[var(--color-primary)]"
                onClick={() => setCurrency(c)}
              >
                <p className="text-2xl font-bold">
                  {c.symbol} <span className="text-base font-semibold">{c.code}</span>
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">{c.label}</p>
              </Card>
            ))}
          </div>
          <Button className="mt-4 w-full min-h-12" type="button" onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}
      {step === 2 && (
        <div className="mt-6 space-y-4">
          <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-text-primary)]">What do you want to learn first?</h1>
          <div className="grid gap-3">
            {(tier === "8-12" ? topics812 : topics1317).map((t) => (
              <button
                key={t.title}
                type="button"
                onClick={() => setFirst(t.id)}
                className={`rounded-2xl border px-4 py-4 text-left ${first === t.id ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}
              >
                <p className="font-bold">{t.title}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{t.blurb}</p>
              </button>
            ))}
          </div>
          <Button className="w-full min-h-12" type="button" onClick={() => void finish()}>
            Start learning
          </Button>
        </div>
      )}
    </div>
  );
}
