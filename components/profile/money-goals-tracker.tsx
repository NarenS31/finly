"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

interface MoneyGoal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency_code: string;
  target_date: string | null;
  completed: boolean;
}

export function MoneyGoalsTracker() {
  const [goals, setGoals] = useState<MoneyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", target_amount: "", target_date: "" });
  const [saving, setSaving] = useState(false);

  const fetchGoals = () =>
    fetch("/api/money-goals")
      .then((r) => r.json())
      .then((d: { goals?: MoneyGoal[] }) => setGoals(d.goals ?? []))
      .finally(() => setLoading(false));

  useEffect(() => { void fetchGoals(); }, []);

  const addGoal = async () => {
    if (!form.title || !form.target_amount) return;
    setSaving(true);
    await fetch("/api/money-goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        target_amount: parseFloat(form.target_amount),
        target_date: form.target_date || null,
      }),
    });
    setForm({ title: "", target_amount: "", target_date: "" });
    setAdding(false);
    setSaving(false);
    void fetchGoals();
  };

  const updateSaved = async (goal: MoneyGoal, delta: number) => {
    const newAmount = Math.min(goal.target_amount, Math.max(0, goal.saved_amount + delta));
    const completed = newAmount >= goal.target_amount;
    if (completed && !goal.completed) {
      confetti({ particleCount: 150, spread: 60, origin: { y: 0.6 }, colors: ["#22c55e", "#fbbf24", "#f97316"] });
    }
    await fetch("/api/money-goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: goal.id, saved_amount: newAmount, completed }),
    });
    void fetchGoals();
  };

  const deleteGoal = async (id: string) => {
    await fetch("/api/money-goals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    void fetchGoals();
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--black)]">Money Goals</h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="rounded-lg bg-[var(--green)] px-3 py-1.5 text-sm font-bold text-white hover:bg-[var(--green-dark)]"
        >
          {adding ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden rounded-2xl border border-[var(--green-border)] bg-[var(--green-bg)] p-5"
          >
            <p className="mb-3 font-bold text-[var(--green-deeper)]">What are you saving for?</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Goal name (e.g. AirPods)"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
              />
              <input
                type="number"
                placeholder="Target amount ($)"
                value={form.target_amount}
                onChange={(e) => setForm((f) => ({ ...f, target_amount: e.target.value }))}
                min="1"
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
              />
              <input
                type="date"
                value={form.target_date}
                onChange={(e) => setForm((f) => ({ ...f, target_date: e.target.value }))}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green)] text-[var(--gray-700)]"
              />
            </div>
            <button
              onClick={addGoal}
              disabled={saving || !form.title || !form.target_amount}
              className="mt-3 rounded-xl bg-[var(--green)] px-5 py-2 text-sm font-bold text-white hover:bg-[var(--green-dark)] disabled:opacity-50"
            >
              {saving ? "Adding…" : "Add Goal"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex h-20 items-center justify-center rounded-2xl border border-[var(--border)]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--green)] border-t-transparent" />
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] p-8 text-center text-[var(--gray-500)]">
          <p className="text-3xl mb-2"></p>
          <p className="font-semibold">No goals yet</p>
          <p className="text-sm mt-1">Add your first savings goal above!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100));
            const remaining = goal.target_amount - goal.saved_amount;
            return (
              <div
                key={goal.id}
                className={`rounded-2xl border p-5 ${goal.completed ? "border-[var(--green-border)] bg-[var(--green-bg)]" : "border-[var(--border)] bg-[var(--white)]"}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-[var(--black)]">
                      {goal.completed && ""}
                      {goal.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--gray-500)]">
                      ${goal.saved_amount.toFixed(2)} of ${goal.target_amount.toFixed(2)} saved
                      {goal.target_date && ` · due ${new Date(goal.target_date).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-[var(--black)]">{pct}%</span>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-xs text-[var(--gray-400)] hover:text-red-500"
                      aria-label="Delete goal"
                    >
                      
                    </button>
                  </div>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--gray-200)]">
                  <motion.div
                    className={`h-full rounded-full ${goal.completed ? "bg-[var(--green)]" : "bg-[var(--green)]"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                {!goal.completed && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-[var(--gray-500)]">
                      ${remaining.toFixed(2)} to go — update savings:
                    </span>
                    <button
                      onClick={() => updateSaved(goal, 5)}
                      className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-bold text-[var(--black)] hover:bg-[var(--green-bg)] hover:border-[var(--green)]"
                    >
                      +$5
                    </button>
                    <button
                      onClick={() => updateSaved(goal, 10)}
                      className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-bold text-[var(--black)] hover:bg-[var(--green-bg)] hover:border-[var(--green)]"
                    >
                      +$10
                    </button>
                    <button
                      onClick={() => updateSaved(goal, 25)}
                      className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-bold text-[var(--black)] hover:bg-[var(--green-bg)] hover:border-[var(--green)]"
                    >
                      +$25
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
