import Image from "next/image";

export function FinlyLogoLowebase({ className = "", size = 32 }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} style={{ height: size }}>
      <Image
        src="/finly-lowebase.png"
        alt="Finly logo"
        width={size}
        height={size}
        style={{ minWidth: size, minHeight: size }}
        priority
      />
      <span className="font-[var(--font-display)] text-2xl font-extrabold text-[var(--color-text-primary)]">
        fin<span className="text-[var(--color-primary)]">ly</span>
      </span>
    </span>
  );
}
