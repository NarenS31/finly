"use client";

import { useState } from "react";
import { Finn } from "@/components/mascot/finn";

// Items unlockable by XP level
interface AvatarItem {
  id: string;
  label: string;
  emoji: string;
  minXp: number;
  category: "hat" | "accessory" | "badge";
}

const HATS: AvatarItem[] = [
  { id: "none_hat", label: "None", emoji: "—", minXp: 0, category: "hat" },
  { id: "cap", label: "Cap", emoji: "🧢", minXp: 0, category: "hat" },
  { id: "graduation", label: "Grad Cap", emoji: "", minXp: 50, category: "hat" },
  { id: "tophat", label: "Top Hat", emoji: "", minXp: 150, category: "hat" },
  { id: "crown", label: "Crown", emoji: "", minXp: 500, category: "hat" },
  { id: "wizard", label: "Wizard", emoji: "🧙", minXp: 1000, category: "hat" },
];

const ACCESSORIES: AvatarItem[] = [
  { id: "none_acc", label: "None", emoji: "—", minXp: 0, category: "accessory" },
  { id: "glasses", label: "Glasses", emoji: "", minXp: 0, category: "accessory" },
  { id: "sunglasses", label: "Shades", emoji: "", minXp: 100, category: "accessory" },
  { id: "bow", label: "Bow Tie", emoji: "", minXp: 200, category: "accessory" },
  { id: "gem", label: "Gem", emoji: "", minXp: 700, category: "accessory" },
];

const BADGES: AvatarItem[] = [
  { id: "none_badge", label: "None", emoji: "—", minXp: 0, category: "badge" },
  { id: "star", label: "Star", emoji: "⭐", minXp: 0, category: "badge" },
  { id: "fire", label: "Fire", emoji: "", minXp: 75, category: "badge" },
  { id: "rocket", label: "Rocket", emoji: "", minXp: 300, category: "badge" },
  { id: "trophy", label: "Trophy", emoji: "", minXp: 700, category: "badge" },
  { id: "money_wings", label: "Money", emoji: "", minXp: 200, category: "badge" },
];

interface AvatarConfig {
  hat: string | null;
  accessory: string | null;
  badge: string | null;
}

interface AvatarBuilderProps {
  userXp: number;
  initialAvatar?: Partial<AvatarConfig>;
  onSave?: (config: AvatarConfig) => void;
}

export function AvatarBuilder({ userXp, initialAvatar = {}, onSave }: AvatarBuilderProps) {
  const [selected, setSelected] = useState<AvatarConfig>({
    hat: initialAvatar.hat ?? "cap",
    accessory: initialAvatar.accessory ?? "none_acc",
    badge: initialAvatar.badge ?? "star",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hatItem = HATS.find((h) => h.id === selected.hat);
  const accItem = ACCESSORIES.find((a) => a.id === selected.accessory);
  const badgeItem = BADGES.find((b) => b.id === selected.badge);

  const save = async () => {
    setSaving(true);
    await fetch("/api/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    setSaving(false);
    setSaved(true);
    onSave?.(selected);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderItems = (items: AvatarItem[], key: keyof AvatarConfig) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const locked = userXp < item.minXp;
        const isSelected = selected[key] === item.id;
        return (
          <button
            key={item.id}
            disabled={locked}
            onClick={() => setSelected((s) => ({ ...s, [key]: item.id }))}
            title={locked ? `Unlock at ${item.minXp} XP` : item.label}
            className={`relative flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-center text-sm transition-all ${
              isSelected
                ? "border-[var(--green)] bg-[var(--green-bg)] text-[var(--green-deeper)]"
                : locked
                  ? "cursor-not-allowed border-[var(--border)] bg-[var(--gray-50)] opacity-40"
                  : "border-[var(--border)] bg-[var(--gray-50)] hover:border-[var(--green)] hover:bg-[var(--green-bg)]"
            }`}
          >
            <span className="text-xl leading-none">{item.emoji}</span>
            <span className="text-[10px] font-semibold leading-none">
              {locked ? `${item.minXp} XP` : item.label}
            </span>
            {locked && (
              <span className="absolute -right-1 -top-1 text-[10px]"></span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 shadow-[var(--shadow-md)]">
      <p className="text-lg font-bold text-[var(--black)]">Avatar Builder</p>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">
        You have <strong className="text-[var(--black)]">{userXp} XP</strong>. Unlock items as you level up!
      </p>

      {/* Preview */}
      <div className="my-5 flex items-center justify-center gap-4 rounded-2xl bg-[var(--gray-50)] py-6">
        <div className="relative">
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl" aria-hidden>
            {hatItem?.emoji !== "—" ? hatItem?.emoji : ""}
          </span>
          <Finn size={72} mood="happy" />
          <span className="absolute -bottom-3 -right-3 text-xl" aria-hidden>
            {accItem?.emoji !== "—" ? accItem?.emoji : ""}
          </span>
        </div>
        {badgeItem?.emoji !== "—" && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">{badgeItem?.emoji}</span>
            <span className="text-xs font-semibold text-[var(--gray-500)]">{badgeItem?.label}</span>
          </div>
        )}
      </div>

      {/* Item pickers */}
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--gray-500)]">Hat</p>
          {renderItems(HATS, "hat")}
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--gray-500)]">Accessory</p>
          {renderItems(ACCESSORIES, "accessory")}
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--gray-500)]">Badge</p>
          {renderItems(BADGES, "badge")}
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-5 w-full rounded-xl bg-[var(--green)] py-3 text-sm font-bold text-white hover:bg-[var(--green-dark)] disabled:opacity-50"
      >
        {saved ? "Saved!" : saving ? "Saving…" : "Save Avatar"}
      </button>
    </div>
  );
}
// export function AvatarBuilder({ userXp, initialAvatar = {}, onSave }: AvatarBuilderProps) {
//   const [selected, setSelected] = useState<AvatarConfig>({
//     hat: initialAvatar.hat ?? "cap",
//     accessory: initialAvatar.accessory ?? "none_acc",
//     badge: initialAvatar.badge ?? "star",
//   });
//   const [saving, setSaving] = useState(false);
//   const [saved, setSaved] = useState(false);
//
//   const hatItem = HATS.find((h) => h.id === selected.hat);
//   const accItem = ACCESSORIES.find((a) => a.id === selected.accessory);
//   const badgeItem = BADGES.find((b) => b.id === selected.badge);
//
//   const save = async () => {
//     setSaving(true);
//     await fetch("/api/avatar", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(selected),
//     });
//     setSaving(false);
//     setSaved(true);
//     onSave?.(selected);
//     setTimeout(() => setSaved(false), 2000);
//   };
//
//   const renderItems = (items: AvatarItem[], key: keyof AvatarConfig) => (
//     <div className="flex flex-wrap gap-2">
//       {/* ...rest of renderItems... */}
//     </div>
//   );
//
//   return (
//     <div>
//       {/* ...Avatar builder UI... */}
//     </div>
//   );
// }
