import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-[78vh] gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="surface-grid rounded-[32px] border border-white/60 bg-[linear-gradient(135deg,rgba(108,99,255,0.14),rgba(29,180,138,0.12),rgba(255,255,255,0.72))] p-8 shadow-[var(--shadow-card)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">Welcome back</p>
        <h1 className="mt-4 text-5xl font-extrabold leading-tight">Pick up where your progress left off.</h1>
        <p className="mt-4 max-w-lg editorial-copy">Log back in to continue lessons, keep your streak alive, and stay on the path you started.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] bg-white/80 p-4 shadow-sm">
            <p className="text-2xl font-bold">12</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Current lesson paths</p>
          </div>
          <div className="rounded-[24px] bg-white/80 p-4 shadow-sm">
            <p className="text-2xl font-bold">72</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Countries learning</p>
          </div>
          <div className="rounded-[24px] bg-white/80 p-4 shadow-sm">
            <p className="text-2xl font-bold">100%</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Free forever</p>
          </div>
        </div>
      </section>
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-8 shadow-[var(--shadow-card)] backdrop-blur sm:p-10">
        <h2 className="mb-4 text-2xl font-bold">Log in</h2>
        <LoginForm />
      </section>
    </div>
  );
}
