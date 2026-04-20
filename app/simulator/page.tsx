import { SpendingSimulator } from "@/components/interactive/spending-simulator";

export default function SpendingSimulatorPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--green)]">Interactive</p>
        <h1 className="mt-2 text-4xl font-extrabold text-[var(--black)]">Spending Simulator</h1>
        <p className="mt-2 text-[var(--gray-500)]">
          10 days. Real decisions. How much will you save?
        </p>
      </div>
      <SpendingSimulator />
    </div>
  );
}
