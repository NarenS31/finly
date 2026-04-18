"use client";

import { useEffect, useRef, useState } from "react";
import { CURRENCY_OPTIONS } from "@/lib/utils/currency-config";
import { useCurrencyStore } from "@/lib/store/currency-store";
import { Icon } from "@/components/ui/icons";

export function CurrencySelector({ compact = true }: { compact?: boolean }) {
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${currency.label}`}
        onClick={() => setOpen((o) => !o)}
        className={`btn-press inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--white)] px-3 py-2 text-sm font-bold text-[var(--black)] ${compact ? "" : "px-4"}`}
      >
        <span className="text-lg leading-none">{currency.symbol}</span>
        {!compact && <span className="hidden text-xs sm:inline">{currency.code}</span>}
        <Icon.ChevronDown className={`h-4 w-4 text-[var(--gray-400)] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--white)] py-1 shadow-[var(--shadow-lg)]"
        >
          {CURRENCY_OPTIONS.map((c) => (
            <li key={c.code} role="option" aria-selected={c.code === currency.code}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-[var(--green-bg)]"
                onClick={() => {
                  setCurrency(c);
                  setOpen(false);
                }}
              >
                <span className="text-lg">{c.symbol}</span>
                <span className="font-semibold text-[var(--black)]">{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
