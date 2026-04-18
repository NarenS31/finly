import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-[78vh] gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="surface-grid rounded-[32px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,140,66,0.18),rgba(108,99,255,0.12),rgba(255,255,255,0.72))] p-8 shadow-[var(--shadow-card)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Create account</p>
        <h1 className="mt-4 text-5xl font-extrabold leading-tight">Build money confidence before real life gets expensive.</h1>
        <p className="mt-4 max-w-lg editorial-copy">Pick your age tier, choose a calculator currency, and start learning in minutes.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-white/80 p-5 shadow-sm">
            <p className="text-xl font-bold">Ages 8-12</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Foundations, habits, and simple decisions.</p>
          </div>
          <div className="rounded-[24px] bg-white/80 p-5 shadow-sm">
            <p className="text-xl font-bold">Ages 13-17</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Banking, debt, taxes, and investing basics.</p>
          </div>
        </div>
      </section>
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-8 shadow-[var(--shadow-card)] backdrop-blur sm:p-10">
        <h2 className="mb-4 text-2xl font-bold">Sign up</h2>
        <SignupForm />
      </section>
    </div>
  );
}
