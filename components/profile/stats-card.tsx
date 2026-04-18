import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function StatsCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </Card>
  );
}
