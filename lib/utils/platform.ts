import type { PlatformStats } from "@/types";
import { createClient } from "@/lib/supabase/server";

const fallback: PlatformStats = {
  totalLessonsCompleted: 12400,
  totalUsers: 3200,
  totalCountries: 47,
};

export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("platform_stats").select("*").eq("id", 1).single();
    if (!data) return fallback;
    return {
      totalUsers: data.total_users ?? fallback.totalUsers,
      totalCountries: data.total_countries ?? fallback.totalCountries,
      totalLessonsCompleted: data.total_lessons_completed ?? fallback.totalLessonsCompleted,
    };
  } catch {
    return fallback;
  }
}
