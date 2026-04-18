import { differenceInCalendarDays, parseISO } from "date-fns";

export function calculateStreak(lastActiveDate?: string | null, currentStreak = 0): number {
  if (!lastActiveDate) return 1;

  const today = new Date();
  const last = parseISO(lastActiveDate);
  const diff = differenceInCalendarDays(today, last);

  if (diff === 0) return currentStreak || 1;
  if (diff === 1) return (currentStreak || 0) + 1;
  return 1;
}
