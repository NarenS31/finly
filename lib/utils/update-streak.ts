import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Updates streak_current / streak_longest / last_active_date when the user is active on a new calendar day.
 */
export async function updateStreak(supabase: SupabaseClient, userId: string): Promise<void> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("streak_current, streak_longest, last_active_date")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    console.error("[updateStreak] profile fetch failed", error?.message);
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const last = profile.last_active_date;

  if (last === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const isConsecutive = last === yesterday;

  const newStreak = isConsecutive ? (profile.streak_current ?? 0) + 1 : 1;
  const newLongest = Math.max(newStreak, profile.streak_longest ?? 0);

  const { error: upErr } = await supabase
    .from("profiles")
    .update({
      streak_current: newStreak,
      streak_longest: newLongest,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (upErr) console.error("[updateStreak] update failed", upErr.message);
}
