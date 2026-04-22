import { CardCollection } from "@/components/cards/card-collection";

export default function CardsPage() {
  return (
    <div className="space-y-8 pb-8">
      <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,247,237,0.96),rgba(254,243,199,0.9)_36%,rgba(255,237,213,0.88)_100%)] p-6 shadow-[0_40px_90px_-52px_rgba(245,158,11,0.45)] sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-12 top-10 h-44 w-44 rounded-full bg-[rgba(245,158,11,0.15)] blur-3xl" />
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-[rgba(239,68,68,0.12)] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[rgba(139,92,246,0.1)] blur-3xl" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 shadow-sm">
            ✦ Collectible Cards
          </div>
          <h1 className="mt-4 font-black text-4xl tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            The Animal Roster
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">
            7 characters. 4 rarities. 25+ unique cards. Earn them through lessons,
            streaks, and challenges — then trade with friends.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {[
              { emoji: "🦊", label: "Finn · Fox" },
              { emoji: "🦉", label: "Ollie · Owl" },
              { emoji: "🐻", label: "Bruno · Bear" },
              { emoji: "🐰", label: "Remi · Rabbit" },
              { emoji: "🦝", label: "Rio · Raccoon" },
              { emoji: "🐺", label: "Wade · Wolf" },
              { emoji: "🦌", label: "Dean · Deer" },
            ].map(({ emoji, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 font-semibold text-[var(--color-text-primary)] shadow-sm backdrop-blur"
              >
                {emoji} {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CardCollection />
    </div>
  );
}
