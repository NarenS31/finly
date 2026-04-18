export function formatMoney(amount: number, symbol: string, maximumFractionDigits = 0) {
  const n = Number.isFinite(amount) ? amount : 0;
  return `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits, minimumFractionDigits: 0 })}`;
}
