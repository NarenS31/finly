import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
        variant === "outline"
          ? "border-[var(--color-primary)] bg-transparent text-[var(--color-primary-dark)]"
          : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)]",
        className
      )}
    >
      {children}
    </span>
  );
}
