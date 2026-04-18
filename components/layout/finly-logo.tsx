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
      <rect x="0" y="6" width="16" height="16" rx="4" fill="#22c55e" />
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
        x="44"
        y="20"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        fontWeight="900"
        fontSize="17"
        fill={lyFill}
        letterSpacing="-0.8"
      >
        ly
      </text>
      <circle
        cx="80"
        cy="14"
        r="5"
        fill={markLight ? "rgba(255,255,255,0.12)" : "#f0fdf4"}
        stroke={markLight ? "rgba(255,255,255,0.35)" : "#bbf7d0"}
        strokeWidth="1.5"
      />
      <path
        d="M77.5 14l2 2 3.5-3.5"
        stroke="#22c55e"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
