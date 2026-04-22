import { cn } from "@/lib/utils/cn";

/** Finly wordmark + mark. Pass `variant="light"` for dark panels (auth left column). */
export function FinlyLogo({ size = "md", variant = "dark" }: { size?: "sm" | "md" | "lg"; variant?: "dark" | "light" }) {
  const scale = size === "sm" ? 0.8 : size === "lg" ? 1.3 : 1;
  const w = Math.round(116 * scale);
  const h = Math.round(28 * scale);
  const finFill = variant === "light" ? "#ffffff" : "var(--black)";
  const lyFill = "#22c55e";
  const markLight = variant === "light";
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 116 28"
      fill="none"
      className={cn("shrink-0")}
      aria-label="Finly"
    >
      <defs>
        <linearGradient id="finlyMarkGradient" x1="0" y1="6" x2="16" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <rect x="0" y="6" width="16" height="16" rx="4" fill="url(#finlyMarkGradient)" />
      <rect x="4" y="2" width="8" height="8" rx="2" fill="#16a34a" />
      <path d="M5 14h6M8 11v6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <text
        x="22"
        y="20"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        fontWeight="900"
        fontSize="17"
        fill={finFill}
        letterSpacing="-0.8"
      >
        fin
      </text>
      <text
        x="41"
        y="20"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        fontWeight="900"
        fontSize="17"
        fill={lyFill}
        letterSpacing="-0.8"
      >
        ly
      </text>
      {/* Removed check mark from logo */}
    </svg>
  );
}
