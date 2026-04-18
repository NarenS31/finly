export function PasswordStrength({ strength }: { strength: number }) {
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const label = labels[Math.min(strength, 3)] ?? "Weak";
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < strength ? "bg-[var(--color-secondary)]" : "bg-[var(--color-border)]"}`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">{label} password</p>
    </div>
  );
}
