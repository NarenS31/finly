"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variantMap: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white shadow-[var(--shadow-primary)] hover:brightness-[1.03] active:scale-[0.98]",
  secondary:
    "bg-[var(--color-secondary)] text-white shadow-[var(--shadow-md)] hover:brightness-[1.05] active:scale-[0.98]",
  ghost:
    "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg)]",
  danger: "bg-[var(--color-error)] text-white hover:brightness-[1.05] active:scale-[0.98]",
};

const sizeMap: Record<Size, string> = {
  sm: "min-h-9 rounded-xl px-3 py-2 text-xs",
  md: "min-h-11 rounded-xl px-5 py-2.5 text-sm",
  lg: "min-h-12 rounded-2xl px-6 py-3 text-base",
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  const { asChild, children, type, ...restProps } = props;
  const buttonClassName = cn(
    "btn-press inline-flex items-center justify-center gap-2 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
    variantMap[variant],
    sizeMap[size],
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(buttonClassName, (children.props as { className?: string }).className),
    });
  }

  return (
    <button type={type ?? "button"} className={buttonClassName} {...restProps}>
      {children}
    </button>
  );
}
