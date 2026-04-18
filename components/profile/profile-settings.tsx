"use client";

import { useState } from "react";
import { CURRENCY_OPTIONS } from "@/lib/utils/currency-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToastStore } from "@/lib/store/toast-store";
import { createClient } from "@/lib/supabase/client";
import type { AgeTier } from "@/types";

export function ProfileSettings({
  initialDisplayName,
  initialAgeTier,
  initialCurrency,
  initialStreakNotify,
  initialWeeklyNotify,
}: {
  initialDisplayName: string;
  initialAgeTier: AgeTier;
  initialCurrency: string;
  initialStreakNotify: boolean;
  initialWeeklyNotify: boolean;
}) {
  const toast = useToastStore((s) => s.show);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [ageTier, setAgeTier] = useState<AgeTier>(initialAgeTier);
  const [currency, setCurrency] = useState(initialCurrency);
  const [streakN, setStreakN] = useState(initialStreakNotify);
  const [weeklyN, setWeeklyN] = useState(initialWeeklyNotify);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast((j as { error?: string }).error ?? "Save failed");
      return;
    }
    toast("Saved");
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-[var(--color-text-primary)]">Display name</label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          onBlur={() => {
            if (displayName !== initialDisplayName) void patch({ display_name: displayName });
          }}
          className="mt-1 min-h-11"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">Age tier</p>
        <div className="mt-2 inline-flex rounded-full border border-[var(--color-border)] p-1">
          {(["8-12", "13-17"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setAgeTier(t);
                void patch({ age_tier: t });
              }}
              className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold ${
                ageTier === t ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-secondary)]"
              }`}
            >
              {t === "8-12" ? "Foundation" : "Real World"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-[var(--color-text-primary)]">Currency (calculators)</label>
        <select
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value);
            void patch({ currency_code: e.target.value });
          }}
          className="mt-1 min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
        >
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.label}
            </option>
          ))}
        </select>
      </div>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" checked={streakN} onChange={(e) => { setStreakN(e.target.checked); void patch({ email_notify_streak: e.target.checked }); }} />
        Email: streak reminder
      </label>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" checked={weeklyN} onChange={(e) => { setWeeklyN(e.target.checked); void patch({ email_notify_weekly: e.target.checked }); }} />
        Email: weekly digest
      </label>
      <div className="border-t border-[var(--color-border)] pt-6">
        <p className="text-sm font-semibold text-[var(--color-error)]">Danger zone</p>
        <Button type="button" variant="danger" className="mt-2" onClick={() => setDeleteOpen(true)}>
          Delete account
        </Button>
      </div>

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete account?">
        <p>This permanently removes your Finly account and progress.</p>
        <div className="mt-4 flex gap-2">
          <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              const res = await fetch("/api/account", { method: "DELETE" });
              if (res.ok) {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/";
              } else {
                const j = await res.json().catch(() => ({}));
                toast((j as { error?: string }).error ?? "Could not delete");
              }
            }}
          >
            Confirm delete
          </Button>
        </div>
      </Modal>
      {saving && <p className="text-xs text-[var(--color-text-muted)]">Saving…</p>}
    </div>
  );
}
