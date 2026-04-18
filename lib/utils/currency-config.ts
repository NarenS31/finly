export const CURRENCY_OPTIONS = [
  { code: "USD", symbol: "$", label: "US Dollar", exampleIncome: 2500, exampleWeekly: 80 },
  { code: "NGN", symbol: "₦", label: "Nigerian Naira", exampleIncome: 45000, exampleWeekly: 5000 },
  { code: "INR", symbol: "₹", label: "Indian Rupee", exampleIncome: 25000, exampleWeekly: 500 },
  { code: "PHP", symbol: "₱", label: "Philippine Peso", exampleIncome: 18000, exampleWeekly: 400 },
  { code: "BRL", symbol: "R$", label: "Brazilian Real", exampleIncome: 2500, exampleWeekly: 50 },
] as const;

export type CurrencyOption = (typeof CURRENCY_OPTIONS)[number];

export function detectCurrency(): CurrencyOption {
  if (typeof navigator === "undefined") return CURRENCY_OPTIONS[0];
  const lang = navigator.language;
  if (lang.includes("NG") || lang.startsWith("yo") || lang.startsWith("ig")) return CURRENCY_OPTIONS[1];
  if (lang.includes("IN") || lang.startsWith("hi") || lang.startsWith("bn")) return CURRENCY_OPTIONS[2];
  if (lang.includes("PH") || lang.startsWith("tl") || lang.startsWith("fil")) return CURRENCY_OPTIONS[3];
  if (lang.includes("BR") || lang.startsWith("pt")) return CURRENCY_OPTIONS[4];
  return CURRENCY_OPTIONS[0];
}

export function getCurrencyByCode(code: string): CurrencyOption {
  return CURRENCY_OPTIONS.find((c) => c.code === code) ?? CURRENCY_OPTIONS[0];
}
